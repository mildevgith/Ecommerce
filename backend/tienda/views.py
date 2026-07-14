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
    if not cadena: return "" # Si la cadena de texto llega vacía, retorna inmediatamente un string en blanco para evitar errores.
    return ''.join((c for c in unicodedata.normalize('NFD', cadena) if unicodedata.category(c) != 'Mn'))
    # Descompone los caracteres con acentos o tildes y filtra eliminando las marcas diacríticas para dejar el texto plano.


# --- CLASE DE PAGINACIÓN PERSONALIZADA ---

class CatalogoPagination(PageNumberPagination):
    """
    Configuración de paginación para el catálogo de productos.
    Divide los resultados devueltos en bloques de 8 elementos.
    """
    page_size = 8                        # Define de forma fija el límite máximo de 8 registros de productos devueltos por cada página.
    page_size_query_param = 'page_size'  # Expone el parámetro en la URL para que el cliente pueda solicitar opcionalmente otro tamaño de página.
    max_page_size = 100                  # Restringe el límite máximo absoluto a 100 registros para proteger el rendimiento de la base de datos.


# --- AUTENTICACIÓN REAL ---

@method_decorator(csrf_exempt, name='dispatch') # Desactiva la verificación del token de seguridad CSRF nativo de Django para permitir peticiones externas de React.
class AuthRegisterView(APIView):
    permission_classes = [AllowAny] # Configura el acceso público para que cualquier visitante anónimo pueda registrarse en la tienda.

    def post(self, request): # Intercepta las solicitudes HTTP POST encargadas del procesamiento del formulario de inscripción.
        data = request.data
        email = data.get('email', '').lower().strip() # Obtiene el correo, lo convierte a letras minúsculas y remueve espacios en blanco en los extremos.
        password = data.get('password')
        nombre = data.get('nombre')  
        whatsapp = data.get('whatsapp', '') 

        if not email or not password: # Valida la presencia de las credenciales obligatorias; si falta alguna, detiene el proceso.
            return Response({"error": "Email y contraseña son obligatorios"}, status=400) # Retorna una respuesta de error con código HTTP 400 Bad Request.

        if User.objects.filter(Q(username=email) | Q(email=email)).exists(): # Ejecuta una consulta OR en SQL para comprobar si el email ya existe como usuario o correo.
            return Response({"error": "Este correo ya está registrado"}, status=400) # Frena el registro duplicado enviando un código de error HTTP 400.

        try: # Abre un bloque de control de excepciones para atrapar cualquier error inesperado en la base de datos.
            with transaction.atomic(): # Envuelve las escrituras en un bloque transaccional atómico; si algo falla, revierte todos los cambios de base de datos.
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=nombre if nombre else ""
                ) # Invoca el método gestor de Django para crear el usuario encriptando la contraseña de forma segura.

                profile, _ = Profile.objects.get_or_create(user=user) # Busca o crea el perfil extendido enlazado al registro del usuario recién creado.
                if whatsapp: # Si el usuario suministró un número de contacto para la aplicación de mensajería.
                    profile.whatsapp = whatsapp # Asigna el teléfono de contacto al atributo correspondiente del modelo de perfil.
                    profile.save() # Persiste y guarda la actualización del número de celular en la tabla física de perfiles.

                return Response({
                    "message": "Usuario creado correctamente",
                    "user": { "email": user.email, "first_name": user.first_name }
                }, status=201) # Retorna una respuesta JSON estructurada con los datos públicos del usuario y un código de éxito HTTP 201 Created.
        except Exception as e:
            return Response({"error": str(e)}, status=500) # Captura el error crítico y devuelve el mensaje de fallo con un código HTTP 500 Internal Error.

@method_decorator(csrf_exempt, name='dispatch') # Exime el control de tokens CSRF para dar compatibilidad total a las peticiones del frontend de React.
class AuthVerifyView(APIView):
    permission_classes = [AllowAny] # Permite el libre acceso al endpoint para procesar los intentos de inicio de sesión de los clientes.
    def post(self, request): # Maneja el método POST que recibe el formulario con las credenciales de acceso de la cuenta.
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password')

        user = authenticate(username=email, password=password) # Llama al motor de autenticación de Django para validar si el correo y la contraseña coinciden.

        if user: # Condicional que comprueba si las credenciales fueron completamente válidas y el usuario existe.
            return Response({
                "message": "Login exitoso",
                "user": { "email": user.email, "first_name": user.first_name }
            }, status=200) # Retorna un mensaje confirmando el acceso correcto junto al perfil público y un estado HTTP 200 OK.
        return Response({"error": "Credenciales inválidas"}, status=401) # Rechaza el acceso con un mensaje de alerta y código HTTP 401 Unauthorized.


# --- CATÁLOGO ---

class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('-id') # Define la consulta inicial trayendo todos los mariscos ordenados del más nuevo al más antiguo.
    serializer_class = TiendaProductoSerializer            # Asigna el serializador encargado de traducir los campos de los productos a formato JSON.
    permission_classes = [AllowAny]                         # Libera el acceso para que el público general pueda navegar y consultar el catálogo de productos.
    pagination_class = CatalogoPagination                  # Vincula la paginación de 8 elementos por página a la respuesta de la lista general.

    def get_queryset(self):
        queryset = self.queryset # Obtiene la consulta base de los productos ordenada por ID de forma descendente.
        
        search = self.request.query_params.get('search', None) # Extrae el parámetro de texto de búsqueda enviado en los filtros de la URL.
        if search:
            self.pagination_class = None # Desactiva por completo la paginación cuando el usuario busca para poder mostrar todos los resultados en una sola lista.
            st = eliminar_tildes(search) # Genera una copia del texto ingresado removiéndole los acentos para dar mayor flexibilidad a la coincidencia.
            queryset = queryset.filter(Q(nombre__icontains=search) | Q(nombre__icontains=st)) # Filtra ignorando mayúsculas si el nombre coincide con el texto original o sin tildes.
            
        categoria_id = self.request.query_params.get('categoria', None) # Captura el identificador numérico de la categoría enviado en los parámetros de la URL.
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id) # Aplica una cláusula WHERE en SQL para segmentar únicamente los pescados de esa categoría.
            
        return queryset.distinct() # Retorna el conjunto de datos final depurado eliminando filas duplicadas mediante un DISTINCT en SQL.

    @action(detail=False, methods=['get'], url_path='recomendados', permission_classes=[AllowAny]) # Define un endpoint personalizado en la ruta /api/productos/recomendados/.
    def recomendados(self, request):
        try:
            productos = TiendaProducto.objects.filter(es_destacado=True)[:4] # Consulta y extrae únicamente los primeros 4 productos que tengan activo el interruptor de destacados.
            if not productos.exists(): # Evaluación lógica de respaldo en caso de que el administrador no haya marcado ningún producto como destacado.
                productos = TiendaProducto.objects.all().order_by('-id')[:4] # Captura como plan de contingencia los últimos 4 mariscos ingresados a la plataforma.
            serializer = self.get_serializer(productos, many=True) # Traduce el arreglo de objetos encontrados a un bloque estructurado de texto JSON.
            return Response(serializer.data, status=status.HTTP_200_OK) # Despacha la lista final de sugerencias al frontend de React con un estado HTTP 200 OK.
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) # Captura y notifica cualquier fallo de base de datos con un código HTTP 400.

    @action(detail=False, methods=['get'], url_path='ofertas', permission_classes=[AllowAny]) # Configura un endpoint personalizado en la ruta /api/productos/ofertas/.
    def ofertas(self, request):
        try:
            self.pagination_class = None # Fuerza la nulidad de la paginación para retornar todas las promociones vigentes en un listado continuo.
            productos = TiendaProducto.objects.filter(en_oferta=True).order_by('-id') # Filtra la tabla extrayendo los productos con descuento activo del más nuevo al más viejo.
            serializer = self.get_serializer(productos, many=True) # Serializa la colección de datos de ofertas en un arreglo estructurado de JSON.
            return Response(serializer.data, status=status.HTTP_200_OK) # Responde con éxito enviando las rebajas disponibles al frontend y un estado HTTP 200 OK.
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) # Devuelve el detalle del error en caso de fallo junto a un código HTTP 400.


# --- PROCESAMIENTO DE PEDIDOS REAL ---

class CrearPedidoView(APIView):
    permission_classes = [AllowAny] # Permite el procesamiento del flujo de checkout tanto para usuarios registrados como en transiciones rápidas.

    def post(self, request): # Declara la recepción de la orden de compra mediante el envío de los datos del carrito en un POST.
        data = request.data
        try:
            with transaction.atomic(): # Asegura la consistencia financiera total; si falla la creación de un ítem, el pedido completo se anula.
                email_cliente = data['datos_envio']['email'].lower().strip()
                # CORRECCIÓN: Buscamos por email O por username (ya que el email puede estar vacío)
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first() # Ejecuta un filtro flexible para capturar el primer usuario que coincida.
                
                if not user: # Validación preventiva de seguridad para verificar la existencia del cliente antes de procesar el pago.
                    return Response({"error": "Usuario no encontrado. Inicie sesión."}, status=404) # Detiene la compra enviando una respuesta HTTP 404 Not Found.

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={
                        'direccion': data['datos_envio']['direccion'],
                        'ciudad': data['datos_envio']['ciudad']
                    }
                ) # Busca el registro del comprador en la tabla de clientes o lo crea al vuelo guardando los datos geográficos de envío.

                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                ) # Crea e inserta la cabecera del pedido guardando el total facturado y fijando su estado logístico inicial.

                for item in data['items']: # Bucle iterativo encargado de desglosar cada uno de los productos que venían dentro del carrito de compras.
                    producto = TiendaProducto.objects.get(id=item['producto_id']) # Busca y valida la existencia del marisco en el inventario mediante su ID único.
                    TiendaDetallepedido.objects.create(
                        pedido=pedido,
                        producto=producto,
                        amount=item['cantidad'],
                        precio_unitario=item['precio_unitario']
                    ) # Inserta en la base de datos la línea de detalle vinculando las unidades compradas y congelando el precio unitario.

                return Response({
                    "message": "Pedido creado con éxito en la base de datos",
                    "pedido_id": pedido.id
                }, status=201) # Envía una respuesta satisfactoria con el ID de la orden generada para la pasarela y un código HTTP 201 Created.

        except KeyError as e:
            return Response({"error": f"Falta el campo: {str(e)}"}, status=400) # Atrapa errores de formato en el JSON si falta alguna llave clave como la dirección.
        except Exception as e:
            return Response({"error": str(e)}, status=400) # Responde detallando cualquier otra excepción o regla rota con un estado HTTP 400.


# --- VIEWSETS RESTANTES ---

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all() # Define la consulta por defecto abstrayendo todas las categorías registradas en el ecommerce.
    serializer_class = TiendaCategoriaSerializer # Configura el formateador para empaquetar el nombre, descripción e imagen de las categorías en JSON.

    @action(detail=True, methods=['get'], url_path='productos', permission_classes=[AllowAny]) # Define un endpoint anidado en la ruta /api/categorias/<id>/productos/.
    def productos(self, request, pk=None):
        try:
            self.pagination_class = None # Limpia el limitador de paginación para retornar de corrido todos los productos pertenecientes a esta categoría.
            categoria = self.get_object() # Ejecuta un control interno para extraer la categoría según el ID (pk) provisto en la URL.
            productos = TiendaProducto.objects.filter(categoria=categoria).order_by('-id') # Filtra el catálogo seleccionando los mariscos de esa familia ordenados por novedad.
            serializer = TiendaProductoSerializer(productos, many=True, context={'request': request}) # Serializa la lista inyectando el contexto de la petición para las URLs de imágenes.
            return Response(serializer.data, status=status.HTTP_200_OK) # Retorna los artículos segmentados al frontend junto a un estado HTTP 200 OK.
        except TiendaCategoria.DoesNotExist:
            return Response({"error": "La categoría especificada no existe"}, status=status.HTTP_404_NOT_FOUND) # Controla el error 404 si la ID de la categoría está errada.
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) # Captura cualquier otro fallo enviando un código de estado HTTP 400.


class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all() # Establece el mapeo de datos apuntando a la tabla maestra de órdenes y compras generales.
    serializer_class = TiendaPedidoSerializer # Asigna el serializador para transformar los montos, estados e IDs de pedidos a JSON.
    permission_classes = [AllowAny] # Permite interactuar con los procesos de enrutamiento automático mapeados en las URLs del backend.

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos el método create para usar tu lógica personalizada
        de CrearPedidoView dentro del router automático.
        """
        data = request.data
        try:
            with transaction.atomic(): # Levanta una transacción blindada de escritura para asegurar que la cabecera y el desglose de productos se guarden juntos.
                email_cliente = data['datos_envio']['email'].lower().strip()
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first() # Ejecuta la consulta combinada para localizar la cuenta del usuario dueño.
                
                if not user:
                    return Response({"error": "Usuario no encontrado."}, status=404) # Retorna un error HTTP 404 cancelando el flujo si la cuenta del cliente no existe.

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={'direccion': data['datos_envio']['direccion'], 'ciudad': data['datos_envio']['ciudad']}
                ) # Resuelve el registro de cliente trayendo el existente o creando uno con la ubicación física suministrada.

                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                ) # Registra e inserta la orden formal asignando los totales económicos y definiendo el estado logístico como Pendiente.

                for item in data['items']: # Ejecuta un bucle por cada uno de los ítems de compra contenidos en el arreglo enviado por React.
                    producto = TiendaProducto.objects.get(id=item['producto_id']) # Trae de la tabla la información del producto marino para asegurar stock y consistencia.
                    TiendaDetallepedido.objects.create(
                        pedido=pedido, producto=producto,
                        cantidad=item['cantidad'], precio_unitario=item['precio_unitario']
                    ) # Escribe las líneas unitarias de facturación congelando cantidades y costos del momento exacto de la compra.

                return Response({"message": "Pedido creado", "pedido_id": pedido.id}, status=201) # Finaliza enviando el número de confirmación de pedido y código HTTP 201 Created.
        except Exception as e:
            return Response({"error": str(e)}, status=400) # Controla y responde con los detalles de cualquier excepción arrojada mediante un código HTTP 400.