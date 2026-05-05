import os
import unicodedata
import random
from django.db import transaction
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
    TiendaProducto, TiendaCategoria, TiendaCarrito, TiendaCliente,
    TiendaPedido, TiendaDetallepedido, TiendaPago, TiendaMetodopago, Profile
)
from .serializers import (
    TiendaProductoSerializer, TiendaCategoriaSerializer,
    TiendaPedidoSerializer, ProfileSerializer
)

def eliminar_tildes(cadena):
    if not cadena: return ""
    return ''.join((c for c in unicodedata.normalize('NFD', cadena) if unicodedata.category(c) != 'Mn'))

# --- AUTENTICACIÓN REAL ---

@method_decorator(csrf_exempt, name='dispatch')
class AuthRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email', '').lower().strip()
        password = data.get('password')
        nombre = data.get('nombre')  # Captura nombre completo
        whatsapp = data.get('whatsapp', '') # Captura WhatsApp si viene

        if not email or not password:
            return Response({"error": "Email y contraseña son obligatorios"}, status=400)

        # Verificamos si el usuario ya existe por email o username
        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            return Response({"error": "Este correo ya está registrado"}, status=400)

        try:
            with transaction.atomic():
                # Creamos el usuario base de Django
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=nombre if nombre else ""
                )

                # Creamos o actualizamos el Perfil extendido (donde está el WhatsApp)
                profile, _ = Profile.objects.get_or_create(user=user)
                if whatsapp:
                    profile.whatsapp = whatsapp
                    profile.save()

                return Response({
                    "message": "Usuario creado correctamente",
                    "user": {
                        "email": user.email,
                        "first_name": user.first_name
                    }
                }, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class AuthVerifyView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password')

        # Autenticación real contra la DB
        user = authenticate(username=email, password=password)

        if user:
            return Response({
                "message": "Login exitoso",
                "user": {
                    "email": user.email,
                    "first_name": user.first_name
                }
            }, status=200)
        return Response({"error": "Credenciales inválidas"}, status=401)

# --- CATÁLOGO ---

class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('-id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = self.queryset
        search = self.request.query_params.get('search', None)
        if search:
            st = eliminar_tildes(search)
            queryset = queryset.filter(Q(nombre__icontains=search) | Q(nombre__icontains=st)).distinct()
        return queryset

# --- PROCESAMIENTO DE PEDIDOS REAL ---

class CrearPedidoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            with transaction.atomic():
                # 1. Obtener el usuario. Si no existe, lanza error (debe estar logueado)
                email_cliente = data['datos_envio']['email'].lower().strip()
                try:
                    user = User.objects.get(email=email_cliente)
                except User.DoesNotExist:
                    return Response({"error": "Usuario no encontrado. Inicie sesión."}, status=404)

                # 2. Obtener o crear el Cliente vinculado al Usuario
                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={
                        'direccion': data['datos_envio']['direccion'],
                        'ciudad': data['datos_envio']['ciudad']
                    }
                )

                # 3. Crear el pedido
                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                )

                # 4. Crear los detalles del pedido a partir del carrito
                for item in data['items']:
                    producto = TiendaProducto.objects.get(id=item['producto_id'])
                    TiendaDetallepedido.objects.create(
                        pedido=pedido,
                        producto=producto,
                        cantidad=item['cantidad'],
                        precio_unitario=item['precio_unitario']
                    )

                return Response({
                    "message": "Pedido creado con éxito en la base de datos",
                    "pedido_id": pedido.id
                }, status=201)

        except KeyError as e:
            return Response({"error": f"Falta el campo: {str(e)}"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# --- VIEWSETS RESTANTES ---

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
