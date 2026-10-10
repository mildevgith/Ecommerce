from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthRegisterView,
    AuthVerifyView,
    ProductCatalogViewSet,
    CrearPedidoView,
    CategoryViewSet,
    OrderViewSet,
    BannerViewSet,
    RecetaViewSet,
    ValidarCuponView,
    RegistrarSuscripcionView
)

# Configuración del Router automático de DRF
router = DefaultRouter()
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet, basename='categoria')
router.register(r'pedidos', OrderViewSet, basename='pedido')
router.register(r'recetas', RecetaViewSet, basename='receta')

urlpatterns = [
    # Rutas del Router de DRF
    path('', include(router.urls)),

    # Rutas de Autenticación
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'),

    # Rutas de Funcionalidades del Ecommerce (Cupones y Suscripciones)
    path('api/validar-cupon/', ValidarCuponView.as_view(), name='validar-cupon'),
    path('api/suscripcion/', RegistrarSuscripcionView.as_view(), name='suscripcion'),
]
