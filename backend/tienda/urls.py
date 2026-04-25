from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthRegisterView, 
    AuthVerifyView, 
    user_dashboard, 
    ProductCatalogViewSet,  # <--- DEBE COINCIDIR AQUÍ
    CategoryViewSet, 
    OrderViewSet
)

router = DefaultRouter()
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet)
router.register(r'pedidos', OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'),
    path('user/dashboard/', user_dashboard, name='user_dashboard'),
]