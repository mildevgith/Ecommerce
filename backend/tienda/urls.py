from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet, TiendaClienteViewSet, TiendaCategoriaViewSet,
    TiendaCarritoViewSet, TiendaPedidoViewSet, PagoViewSet,
    RegisterView, RequestOTPView, VerifyOTPView
)

from .views import ProfileViewSet, UserOTPViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'clientes', TiendaClienteViewSet, basename='clientes')
router.register(r'categorias', TiendaCategoriaViewSet, basename='categorias')
router.register(r'carritos', TiendaCarritoViewSet, basename='carritos')
router.register(r'pedidos', TiendaPedidoViewSet, basename='pedidos')
router.register(r'pago', PagoViewSet, basename='pago')
router.register(r'profile', ProfileViewSet)
router.register(r'otp', UserOTPViewSet)

urlpatterns = [
    
    path('', include(router.urls)),


    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
]
