import os
import unicodedata  # Herramienta para limpiar textos (quitar tildes)
from django.db.models import Q # Sirve para hacer búsquedas complejas (Ej: nombre O descripción)
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

# --- FUNCIÓN DE AYUDA: El "Limpiador" de texto ---

def eliminar_tildes(cadena):
    """Si el usuario busca 'Camarón', lo convierte en 'Camaron' para que el buscador no falle"""
    if not cadena:
        return ""
    return ''.join((c for c in unicodedata.normalize('NFD', cadena) if unicodedata.category(c) != 'Mn'))

# --- SECCIÓN 1: REGISTRO Y LOGIN (Autenticación) ---

@method_decorator(csrf_exempt, name='dispatch') # Permite que React envíe datos sin bloqueos de seguridad básicos
class AuthRegisterView(APIView):
    permission_classes = [AllowAny] # Cualquier persona puede entrar a registrarse

    def post(self, request):
        # Recibo los datos que escribiste en el formulario de React
        email = request.data.get('email')
        password = request.data.get('password')
        whatsapp = request.data.get('whatsapp')

        if not email or not password:
            return Response({"error": "Email y contraseña son obligatorios"}, status=400)

        email = email.lower().strip() # Limpio el email de espacios y mayúsculas
        # Reviso si ese correo ya existe en la base de datos
        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            return Response({"error": "El usuario ya existe"}, status=400)

        try:
            # Creo el usuario oficial de Django
            user = User.objects.create_user(username=email, email=email, password=password)
            user.is_active = True
            user.save()

            # Gracias a las signals, el perfil ya existe, pero aquí le guardamos el WhatsApp
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

        # Intento buscar al usuario por su correo
        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=401)

        # Verifico si la contraseña coincide con la guardada
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

# --- SECCIÓN 2: EL PANEL DEL USUARIO (Dashboard) ---

@api_view(['GET'])
@permission_classes([AllowAny])
def user_dashboard(request):
    """Esta es la función que alimenta tu Navbar y tu perfil"""
    email = request.query_params.get('email', '').lower().strip()
    if not email:
        return Response({"error": "Email requerido"}, status=400)

    try:
        # Busco el perfil, los últimos 5 pedidos y 4 ofertas destacadas
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

# --- SECCIÓN 3: EL CATÁLOGO (Donde vive tu buscador) ---

class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('-id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly] # Todos ven, solo logueados compran

    def get_queryset(self):
        """Aquí es donde filtramos los pescados según lo que escribas en el buscador"""
        queryset = self.queryset

        # Filtro rápido: ¿El usuario solo quiere ver ofertas?
        only_offers = self.request.query_params.get('offers', None)
        if only_offers:
            queryset = queryset.filter(en_oferta=True)

        # --- LÓGICA DEL BUSCADOR ---
        search = self.request.query_params.get('search', None)
        if search:
            # Limpio lo que el usuario escribió (quito tildes)
            search_sin_tildes = eliminar_tildes(search)

            # Busco en el Nombre y en la Descripción, ignorando mayúsculas e ignorando tildes
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(nombre__icontains=search_sin_tildes) |
                Q(descripcion__icontains=search) |
                Q(descripcion__icontains=search_sin_tildes)
            ).distinct() # El .distinct() evita que un producto salga dos veces

        return queryset

# Vistas automáticas para Categorías y Pedidos
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
