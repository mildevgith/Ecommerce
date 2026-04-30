from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthRegisterView, AuthVerifyView, ProductCatalogViewSet,
    CategoryViewSet, OrderViewSet, CrearPedidoView
)

router = DefaultRouter()
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet)
router.register(r'pedidos-lista', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'),
    path('pedidos/', CrearPedidoView.as_view(), name='crear_pedido'), # Ruta para el Checkout
]
