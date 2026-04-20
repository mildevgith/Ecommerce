from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductCatalogViewSet,
    CategoryViewSet,
    OrderViewSet,
    AuthRegisterView,
    AuthVerifyView,
    user_dashboard  # <-- IMPORTANTE: Esto faltaba
)

router = DefaultRouter()
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet, basename='categoria')
router.register(r'pedidos', OrderViewSet, basename='pedido')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/verify/', AuthVerifyView.as_view(), name='auth_verify'),
    path('user/dashboard/', user_dashboard, name='user_dashboard'), # <-- Ruta añadida
]
