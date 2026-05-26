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
router = DefaultRouter()
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet, basename='categoria')
router.register(r'pedidos', OrderViewSet, basename='pedido')


# --- VISTA RÁPIDA PARA PROCESAR LA SUSCRIPCIÓN ---
class SuscribirNewsletterView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        
        if not email:
            return Response({"error": "Por favor, ingresa un correo válido."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si ya existe en la base de datos
        if TiendaSuscripcion.objects.filter(email=email).exists():
            return Response({"message": "Este correo ya se encuentra registrado."}, status=status.HTTP_200_OK)
            
        try:
            TiendaSuscripcion.objects.create(email=email)
            return Response({"success": "¡Te has suscrito correctamente!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Hubo un problema al procesar tu solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'), 
    path('suscripciones/', SuscribirNewsletterView.as_view(), name='suscribir_newsletter'),
    # Ya no necesitas 'crear-pedido/' porque el router /api/pedidos/ ya lo hace.
]