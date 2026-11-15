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
from .models import Receta
from .serializers import RecetaSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import TiendaCupondescuento, TiendaSuscripcion
from .models import TiendaSuscripcion
from .models import (
  TiendaProducto, TiendaCategoria, TiendaCarrito, TiendaCliente,
  TiendaPedido, TiendaDetallepedido, TiendaPago, TiendaMetodopago, Profile, TiendaBanner,
)
from .serializers import (
  TiendaProductoSerializer, TiendaCategoriaSerializer,
  TiendaPedidoSerializer, ProfileSerializer, TiendaBannerSerializer
)


class RecetaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para el modelo Receta.
    Permite realizar operaciones CRUD completas sobre las recetas de la tienda,
    ordenándolas por ID de forma descendente (las más recientes primero).
    """
    queryset = Receta.objects.all().order_by('-id')
    serializer_class = RecetaSerializer


def get_queryset(self):
        """
        Filtra dinámicamente el catálogo de productos según los parámetros de búsqueda o categoría recibidos en la URL,
        ignorando mayúsculas, minúsculas y tildes gracias a __unaccent.
        """
        queryset = self.queryset

        search = self.request.query_params.get('search', None)
        if search:
            self.pagination_class = None
            # Usamos unaccent__icontains para buscar ignorando tildes y mayúsculas en PostgreSQL
            queryset = queryset.filter(nombre__unaccent__icontains=search)

        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)

        return queryset.distinct()


class CatalogoPagination(PageNumberPagination):
    """
    Configuración de paginación personalizada para el catálogo de productos.
    Divide los resultados devueltos en bloques de 8 elementos por página.
    """
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

    """
    Configuración de paginación para el catálogo de productos.
    Divide los resultados devueltos en bloques de 8 elementos.
    """
    page_size = 8                        # Define de forma fija el límite máximo de 8 registros de productos devueltos por cada página.
    page_size_query_param = 'page_size'    # Expone el parámetro en la URL para que el cliente pueda solicitar opcionalmente otro tamaño de página.
    max_page_size = 100                  # Restringe el límite máximo absoluto a 100 registros para proteger el rendimiento de la base de datos.



@method_decorator(csrf_exempt, name='dispatch')
class AuthRegisterView(APIView):
    """
    Vista de API encargada del registro de nuevos usuarios en el sistema.
    Valida datos obligatorios, comprueba si el correo ya existe,
    crea el usuario y su perfil asociado de forma atómica.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Procesa la petición HTTP POST con los datos de registro (email, contraseña, nombre y whatsapp),
        creando la cuenta y retornando un mensaje de éxito o error.
        """
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
                    "user": { "email": user.email, "first_name": user.first_name }
                }, status=201)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class AuthVerifyView(APIView):
    """
    Vista de API para verificar las credenciales de inicio de sesión (Login) de un usuario.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Recibe email y contraseña, autentica contra la base de datos de Django
        y retorna una respuesta de éxito o error de credenciales.
        """
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user:
            return Response({
                "message": "Login exitoso",
                "user": { "email": user.email, "first_name": user.first_name }
            }, status=200)
        return Response({"error": "Credenciales inválidas"}, status=401)


class BannerViewSet(viewsets.ModelViewSet):
    """
    ViewSet para administrar los banners de la tienda de forma pública.
    """
    queryset = TiendaBanner.objects.all()
    serializer_class = TiendaBannerSerializer
    permission_classes = [AllowAny]

class LegacyBannerViewSet(viewsets.ModelViewSet):
    """
    ViewSet de respaldo (Legacy) para mantener compatibilidad con endpoints antiguos de banners.
    """
    queryset = TiendaBanner.objects.all()
    serializer_class = TiendaBannerSerializer
    permission_classes = [AllowAny]

class ProductCatalogViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para el catálogo de productos.
    Soporta paginación, filtros de búsqueda por texto (ignorando tildes) y filtrado por categoría,
    además de acciones personalizadas para productos recomendados y en oferta.
    """
    queryset = TiendaProducto.objects.all().order_by('-id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [AllowAny]
    pagination_class = CatalogoPagination

    queryset = TiendaProducto.objects.all().order_by('-id') # Define la consulta inicial trayendo todos los productos ordenados del más nuevo al más antiguo.
    serializer_class = TiendaProductoSerializer            # Asigna el serializador encargado de traducir los campos de los productos a formato JSON.
    permission_classes = [AllowAny]                        # Libera el acceso para que el público general pueda navegar y consultar el catálogo de productos.
    pagination_class = CatalogoPagination                  # Vincula la paginación de 8 elementos por página a la respuesta de la lista general.


    def get_queryset(self):
        """
        Filtra dinámicamente el catálogo de productos según los parámetros de búsqueda o categoría recibidos en la URL.
        """
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
        """
        Endpoint personalizado que retorna hasta 4 productos destacados,
        o los últimos 4 productos agregados si no hay destacados disponibles.
        """
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
        """
        Endpoint personalizado que lista todos los productos que se encuentran actualmente en oferta.
        """
        try:
            self.pagination_class = None
            productos = TiendaProducto.objects.filter(en_oferta=True).order_by('-id')
            serializer = self.get_serializer(productos, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CrearPedidoView(APIView):
    """
    Vista de API dedicada a procesar y registrar la creación de un nuevo pedido de compra
    dentro de una transacción segura de base de datos.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Recibe la información de envío, usuario y elementos del carrito,
        registra al cliente, genera el pedido y almacena cada detalle de producto asociado.
        """
        data = request.data
        try:
            with transaction.atomic():
                email_cliente = data['datos_envio']['email'].lower().strip()
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

                # Serializamos el pedido completo para que la factura del frontend reciba todos los datos necesarios
                serializer = TiendaPedidoSerializer(pedido)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except KeyError as e:
            return Response({"error": f"Falta el campo: {str(e)}"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)




# --- VIEWSETS RESTANTES ---


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las categorías de productos, permitiendo filtrar
    los productos pertenecientes a una categoría específica mediante su campo 'slug'.
    """
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


    @action(detail=True, methods=['get'], url_path='productos', permission_classes=[AllowAny])
    def productos(self, request, slug=None):
        """
        Acción personalizada que retorna la lista de productos asociados
        a una categoría consultada a través de su 'slug'.
        """
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

            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) # Captura cualquier otro fallo enviando un código de estado HTTP 400.



class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet para administrar los pedidos de la tienda dentro del enrutador automático de DRF.
    """
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método create predeterminado para gestionar la creación personalizada
        de pedidos, validación de clientes y registro de detalles de compra.
        """


        """
        Sobrescribimos el método create para usar la lógica personalizada
        de creación de pedidos dentro del router automático y retornar el objeto completo.
        """

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

                return Response({"message": "Pedido creado", "pedido_id": pedido.id}, status=201) #

                    # Escribe las líneas unitarias de facturación congelando cantidades y costos del momento exacto de la compra.

                # Serializamos y retornamos el objeto completo para alimentar correctamente la factura en el frontend
                serializer = self.get_serializer(pedido)
                return Response(serializer.data, status=status.HTTP_201_CREATED)


        except Exception as e:
            return Response({"error": str(e)}, status=400)


class ValidarCuponView(APIView):
    """
    Vista de API encargada de validar códigos de cupones de descuento
    y calcular el monto aplicable sobre el total del carrito del cliente.
    """
    def post(self, request):
        """
        Procesa la solicitud HTTP POST para verificar existencia, vigencia y cálculo
        del descuento de un cupón ingresado.
        """
        codigo = request.data.get('codigo', '').strip().upper()
        total_carrito = float(request.data.get('total', 0))

        if not codigo:
            return Response({"error": "Ingresa un código de cupón válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cupon = TiendaCupondescuento.objects.get(codigo=codigo, activo=True)


            if cupon.fecha_expiracion and cupon.fecha_expiracion < timezone.now().date():
                return Response({"error": "Este cupón ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

            monto_descuento = (total_carrito * float(cupon.porcentaje_descuento)) / 100

            return Response({
                "valido": True,
                "codigo": cupon.codigo,
                "descuento": monto_descuento,
                "mensaje": f"¡Cupón '{cupon.codigo}' aplicado con éxito!"
            }, status=status.HTTP_200_OK)

        except TiendaCupondescuento.DoesNotExist:
            return Response({"error": "El cupón ingresado no existe o no está activo."}, status=status.HTTP_404_NOT_FOUND)
    def post(self, request):
        """
        Método secundario post para validación extendida de cupones con soporte
        para porcentajes o montos fijos de descuento.
        """
        codigo = request.data.get('codigo', '').strip().upper()
        total_carrito = float(request.data.get('total', 0))

        if not codigo:
            return Response({"error": "Ingresa un código de cupón válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cupon = TiendaCupondescuento.objects.get(codigo=codigo, activo=True)


            # Validar fecha de expiración si el modelo la tiene

            if hasattr(cupon, 'fecha_expiracion') and cupon.fecha_expiracion:
                if cupon.fecha_expiracion < timezone.now().date():
                    return Response({"error": "Este cupón ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

            monto_descuento = 0
            if hasattr(cupon, 'porcentaje_descuento') and cupon.porcentaje_descuento:
                monto_descuento = (total_carrito * float(cupon.porcentaje_descuento)) / 100
            elif hasattr(cupon, 'monto_fijo') and cupon.monto_fijo:
                monto_descuento = float(cupon.monto_fijo)

            return Response({
                "valido": True,
                "codigo": cupon.codigo,
                "descuento": monto_descuento,
                "mensaje": f"¡Cupón '{cupon.codigo}' aplicado con éxito!"
            }, status=status.HTTP_200_OK)

        except TiendaCupondescuento.DoesNotExist:
            return Response({"error": "El cupón ingresado no existe o no está activo."}, status=status.HTTP_404_NOT_FOUND)


class RegistrarSuscripcionView(APIView):
    """
    Vista de API destinada a gestionar las suscripciones de correo electrónico
    de los usuarios interesados en novedades o boletines de la tienda.
    """
    def post(self, request):
        """
        Registra un nuevo correo de suscripción validando que no se encuentre duplicado
        en la base de datos.
        """
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response({"error": "Por favor, ingresa un correo válido."}, status=status.HTTP_400_BAD_REQUEST)

        if TiendaSuscripcion.objects.filter(email=email).exists():
            return Response({"message": "Este correo ya se encuentra registrado."}, status=status.HTTP_200_OK)

        try:
            TiendaSuscripcion.objects.create(email=email)
            return Response({"success": "¡Te has suscrito correctamente!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Hubo un problema al procesar tu solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
