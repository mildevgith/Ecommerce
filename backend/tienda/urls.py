from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Traigo todas las "vistas" (funciones de lógica) que creamos para mi tienda
from .views import (
    AuthRegisterView,
    AuthVerifyView,
    user_dashboard,
    ProductCatalogViewSet,  # El catálogo de pescados y mariscos
    CategoryViewSet,
    OrderViewSet
)

# --- EL ENRUTADOR AUTOMÁTICO ---
# El Router es un invento de Django Rest Framework que me ahorra trabajo.
# En lugar de escribir una ruta para "ver", otra para "borrar" y otra para "editar",
# el router las crea todas automáticamente basándose en el ViewSet.
router = DefaultRouter()
router.register(r'productos', ProductCatalogViewSet, basename='producto')
router.register(r'categorias', CategoryViewSet)
router.register(r'pedidos', OrderViewSet)

# --- MAPA DE RUTAS DE LA TIENDA ---
urlpatterns = [
    # Aquí incluyo todas las rutas que el router fabricó (productos, categorías, pedidos)
    path('', include(router.urls)),

    # Rutas manuales para la autenticación (lo que usas en tu componente Cuenta.jsx)
    # Estas no usan Router porque son acciones muy específicas (Registrar, Entrar)
    path('auth/register/', AuthRegisterView.as_view(), name='auth_register'),
    path('auth/login/', AuthVerifyView.as_view(), name='auth_login'),

    # Esta es la ruta que trae los puntos, el WhatsApp y el email del usuario logueado
    path('user/dashboard/', user_dashboard, name='user_dashboard'),
]
