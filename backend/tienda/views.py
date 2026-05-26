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
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.pagination import PageNumberPagination

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


# --- CLASE DE PAGINACIÓN PERSONALIZADA ---

class CatalogoPagination(PageNumberPagination):
    """
    Configuración de paginación para el catálogo de productos.
    Divide los resultados devueltos en bloques de 8 elementos.
    """
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100


# --- AUTENTICACIÓN REAL ---

@method_decorator(csrf_exempt, name='dispatch')
class AuthRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get('email', '').lower().strip()
        password = data.get('password')
        nombre = data.get('nombre')  
        whatsapp = data.get('whatsapp', '') 

        if not email or not password:
            return Response({"error": "Email y contraseña son obligatorios"}, status=400)

        if User.objects.filter(Q(username=email) | Q(email=email)).exists():
            return Response({"error": "Este correo ya está registrado"}, status=400)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=nombre if nombre else ""
                )

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
    pagination_class = CatalogoPagination  

    def get_queryset(self):
        queryset = self.queryset
        
        search = self.request.query_params.get('search', None)
        if search:
            self.pagination_class = None
            st = eliminar_tildes(search)
            queryset = queryset.filter(Q(nombre__icontains=search) | Q(nombre__icontains=st))
            
        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
            
        return queryset.distinct()

    @action(detail=False, methods=['get'], url_path='recomendados', permission_classes=[AllowAny])
    def recomendados(self, request):
        try:
            productos = TiendaProducto.objects.filter(es_destacado=True)[:4]
            if not productos.exists():
                productos = TiendaProducto.objects.all().order_by('-id')[:4]
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='ofertas', permission_classes=[AllowAny])
    def ofertas(self, request):
        try:
            self.pagination_class = None 
            productos = TiendaProducto.objects.filter(en_oferta=True).order_by('-id')
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# --- PROCESAMIENTO DE PEDIDOS REAL ---

class CrearPedidoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            with transaction.atomic():
                email_cliente = data['datos_envio']['email'].lower().strip()
                # CORRECCIÓN: Buscamos por email O por username (ya que el email puede estar vacío)
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first()
                
                if not user:
                    return Response({"error": "Usuario no encontrado. Inicie sesión."}, status=404)

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={
                        'direccion': data['datos_envio']['direccion'],
                        'ciudad': data['datos_envio']['ciudad']
                    }
                )

                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                )

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

    @action(detail=True, methods=['get'], url_path='productos', permission_classes=[AllowAny])
    def productos(self, request, pk=None):
        try:
            self.pagination_class = None
            categoria = self.get_object()
            productos = TiendaProducto.objects.filter(categoria=categoria).order_by('-id')
            serializer = TiendaProductoSerializer(productos, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TiendaCategoria.DoesNotExist:
            return Response({"error": "La categoría especificada no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- Sustituye tu clase OrderViewSet al final de views.py ---

class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos el método create para usar tu lógica personalizada
        de CrearPedidoView dentro del router automático.
        """
        data = request.data
        try:
            with transaction.atomic():
                email_cliente = data['datos_envio']['email'].lower().strip()
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first()
                
                if not user:
                    return Response({"error": "Usuario no encontrado."}, status=404)

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={'direccion': data['datos_envio']['direccion'], 'ciudad': data['datos_envio']['ciudad']}
                )

                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                )

                for item in data['items']:
                    producto = TiendaProducto.objects.get(id=item['producto_id'])
                    TiendaDetallepedido.objects.create(
                        pedido=pedido, producto=producto,
                        cantidad=item['cantidad'], precio_unitario=item['precio_unitario']
                    )

                return Response({"message": "Pedido creado", "pedido_id": pedido.id}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)