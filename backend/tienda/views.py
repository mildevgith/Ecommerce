import os
import unicodedata  # Para normalizar tildes
from django.db.models import Q
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny

from .models import (
    TiendaProducto, TiendaCategoria, TiendaCarrito,
    TiendaPedido, TiendaPago, UserOTP, Profile
)
    
from .serializers import (
    TiendaProductoSerializer, TiendaCategoriaSerializer,
    TiendaCarritoSerializer, TiendaPedidoSerializer,
    TiendaPagoSerializer, ProfileSerializer
)

# --- FUNCIÓN DE AYUDA PARA BUSCADOR (NORMALIZACIÓN) ---

def eliminar_tildes(cadena):
    """Convierte 'Á' en 'A', 'é' en 'e', etc. para búsquedas flexibles"""
    if not cadena:
        return ""
    return ''.join((c for c in unicodedata.normalize('NFD', cadena) if unicodedata.category(c) != 'Mn'))

# --- SECCIÓN 1: AUTENTICACIÓN (Mantenida intacta) ---

@method_decorator(csrf_exempt, name='dispatch')
class AuthRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        whatsapp = request.data.get('whatsapp')

        if not email or not password:
            return Response({"error": "Email y contraseña son obligatorios"}, status=400)

        email = email.lower().strip()
        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            return Response({"error": "El usuario ya existe"}, status=400)

        try:
            user = User.objects.create_user(username=email, email=email, password=password)
            user.is_active = True 
            user.save()

            profile, _ = Profile.objects.get_or_create(user=user)
            profile.whatsapp = whatsapp if whatsapp else ""
            profile.save()

            return Response({"message": "Usuario creado correctamente"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class AuthVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password')
        
        if not email or not password:
            return Response({"error": "Faltan credenciales"}, status=400)

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=401)

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                return Response({
                    "message": "Login exitoso", 
                    "user": {
                        "email": user.email, 
                        "username": user.username,
                        "first_name": user.first_name
                    }
                }, status=200)
            return Response({"error": "Esta cuenta está desactivada"}, status=403)
            
        return Response({"error": "Contraseña incorrecta"}, status=401)

# --- SECCIÓN 2: DASHBOARD (Mantenida intacta) ---

@api_view(['GET'])
@permission_classes([AllowAny])
def user_dashboard(request):
    email = request.query_params.get('email', '').lower().strip()
    if not email:
        return Response({"error": "Email requerido"}, status=400)
        
    try:
        profile = Profile.objects.get(user__email=email)
        recent_orders = TiendaPedido.objects.filter(cliente__user__email=email).order_by('-id')[:5]
        featured_offers = TiendaProducto.objects.filter(en_oferta=True)[:4]

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

# --- SECCIÓN 3: CATÁLOGO Y PEDIDOS (Con buscador mejorado) ---

class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('-id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = self.queryset
        
        # Filtro de ofertas
        only_offers = self.request.query_params.get('offers', None)
        if only_offers:
            queryset = queryset.filter(en_oferta=True)
            
        # BUSCADOR MEJORADO: Ignora tildes y mayúsculas
        search = self.request.query_params.get('search', None)
        if search:
            search_sin_tildes = eliminar_tildes(search)
            # Filtramos comparando tanto el término original como el término sin tildes
            queryset = queryset.filter(
                Q(nombre__icontains=search) | 
                Q(nombre__icontains=search_sin_tildes) |
                Q(descripcion__icontains=search) |
                Q(descripcion__icontains=search_sin_tildes)
            ).distinct() # distinct() evita duplicados si el término coincide en nombre y descripción
            
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer