import os
from django.db.models import Q
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from twilio.rest import Client
from dotenv import load_dotenv

from .models import (
    TiendaProducto, TiendaCategoria, TiendaCarrito,
    TiendaPedido, TiendaPago, UserOTP, Profile
)
from .serializers import (
    TiendaProductoSerializer, TiendaCategoriaSerializer,
    TiendaCarritoSerializer, TiendaPedidoSerializer,
    TiendaPagoSerializer, ProfileSerializer
)

load_dotenv()

# --- SECCIÓN 1: AUTENTICACIÓN ---

class AuthRegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        whatsapp = request.data.get('whatsapp')

        if not email or not password or not whatsapp:
            return Response({"error": "Todos los campos son obligatorios"}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({"error": "El usuario ya existe"}, status=400)

        user = User.objects.create_user(username=email, email=email, password=password)

        # Usamos get_or_create por si el Signal no se disparó
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.whatsapp = whatsapp
        profile.save()

        return Response({"message": "Usuario creado correctamente"}, status=201)

class AuthVerifyView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)
        if user:
            return Response({"message": "Login exitoso", "user": {"email": email}})
        return Response({"error": "Credenciales inválidas"}, status=401)

# --- SECCIÓN 2: DASHBOARD (CUENTA) ---

@api_view(['GET'])
def user_dashboard(request):
    email = request.query_params.get('email')
    serializer = ProfileSerializer(profile)
    if not email:
        return Response({"error": "Email requerido"}, status=400)
    try:
        profile = Profile.objects.get(user__email=email)
        recent_orders = TiendaPedido.objects.filter(cliente__user__email=email).order_by('-id')[:5]
        featured_offers = TiendaProducto.objects.filter(en_oferta=True)[:4]
        profile = Profile.objects.get(user__email=email)


        return Response({
            "profile": {
                "user": {"email": email},
                "whatsapp": profile.whatsapp,
                "puntos": profile.puntos
            },
            "orders": TiendaPedidoSerializer(recent_orders, many=True).data,
            "offers": TiendaProductoSerializer(featured_offers, many=True).data
        })
    except Profile.DoesNotExist:
        return Response({"error": "Perfil no encontrado"}, status=404)

# --- SECCIÓN 3: CATÁLOGO ---

class ProductCatalogViewSet(viewsets.ModelViewSet):
    serializer_class = TiendaProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = TiendaProducto.objects.all().order_by('-id')
        only_offers = self.request.query_params.get('offers', None)
        if only_offers:
            queryset = queryset.filter(en_oferta=True)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(Q(nombre__icontains=search) | Q(descripcion__icontains=search))
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
