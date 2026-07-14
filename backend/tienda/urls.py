from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TiendaSuscripcion
from .views import (
    AuthRegisterView,
    AuthVerifyView,
    ProductCatalogViewSet,
    CrearPedidoView,
    CategoryViewSet,
    OrderViewSet
)

# Configuración del Router automático de DRF
(   AuthRegisterView,
    AuthVerifyView,
    ProductCatalogViewSet,
    CrearPedidoView,
    CategoryViewSet,
    OrderViewSet
)

# Configuración del Router automático de DRF
router = DefaultRouter() # Instancia el enrutador automático de Django Rest Framework para generar URLs estándar de tipo CRUD.
router.register(r'productos', ProductCatalogViewSet, basename='producto') # Genera automáticamente las rutas HTTP (GET, POST, PUT, DELETE) para el catálogo de productos.
router.register(r'categorias', CategoryViewSet, basename='categoria')     # Genera automáticamente los endpoints para listar y administrar las familias de mariscos.
router.register(r'pedidos', OrderViewSet, basename='pedido')              # Mapea de forma automática todo el flujo y endpoints correspondientes a las órdenes de compra.


# --- VISTA RÁPIDA PARA PROCESAR LA SUSCRIPCIÓN ---
class SuscribirNewsletterView(APIView): # Declara una vista basada en clase del tipo APIView para procesar solicitudes HTTP personalizadas de suscripción.
    def post(self, request): # Sobrescribe el método HTTP POST para capturar los datos enviados por los formularios del frontend.
        email = request.data.get('email', '').strip().lower() # Extrae el campo de correo, remueve espacios en blanco externos y lo convierte todo a minúsculas.
        
        if not email: # Estructura una validación lógica para comprobar si la variable del correo electrónico llegó vacía.
            return Response({"error": "Por favor, ingresa un correo válido."}, status=status.HTTP_400_BAD_REQUEST) # Retorna una respuesta JSON de error con un código de estado HTTP 400 Bad Request.
        
        # Verificar si ya existe en la base de datos
        if TiendaSuscripcion.objects.filter(email=email).exists(): # Ejecuta un query SQL con la propiedad exist para validar si el correo ya está en el sistema.
            return Response({"message": "Este correo ya se encuentra registrado."}, status=status.HTTP_200_OK) # Retorna un mensaje informativo de éxito para el cliente usando un estado HTTP 200 OK.
            
        try: # Abre un bloque de control de excepciones para mitigar fallas en tiempo de ejecución durante la escritura en base de datos.
            TiendaSuscripcion.objects.create(email=email) # Ejecuta un comando SQL de inserción para crear y salvar el nuevo registro de correo en la tabla.
            return Response({"success": "¡Te has suscrito correctamente!"}, status=status.HTTP_201_CREATED) # Retorna un mensaje JSON confirmando el registro con un estado HTTP 201 Created.
        except Exception as e: # Captura cualquier error o fallo imprevisto que ocurra durante la consulta o la inserción de base de datos.
            return Response({"error": "Hubo un problema al procesar tu solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) # Retorna una alerta estructurada de error con un código de estado HTTP 500 Internal Server Error.


urlpatterns = [
    # Rutas del router (maneja /api/productos/ y /api/productos/recomendados/)
    path('', include(router.urls)), # Incluye de manera directa el paquete de rutas automáticas e indexadas que configuró el router previamente.
    
    # Rutas basadas en APIViews normales
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'), # Enlaza el endpoint de registro de cuentas convirtiendo la APIView a una vista compatible con Django.
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'),         # Vincula el endpoint para la autenticación y validación de credenciales o códigos OTP de acceso.
    path('suscripciones/', SuscribirNewsletterView.as_view(), name='suscribir_newsletter'), # Expone la URL final para recibir las solicitudes de suscripción al boletín informativo.
    # Ya no necesitas 'crear-pedido/' porque el router /api/pedidos/ ya lo hace.
]