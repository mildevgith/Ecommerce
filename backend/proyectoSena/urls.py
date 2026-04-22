"""
URL Configuration para proyectoSena

Este archivo centraliza todas las rutas del proyecto. 
Se utiliza el prefijo 'api/' para separar los endpoints del backend 
de la interfaz administrativa.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Definición de las rutas principales
urlpatterns = [
    # Interfaz de administración de Django
    path('admin/', admin.site.urls),
    
    # Endpoints de la API: Incluye las rutas de la aplicación 'tienda'
    # Se recomienda el uso de versiones (ej: 'api/v1/') para proyectos escalables
    path('api/', include('tienda.urls')),
]

# Configuración para servir archivos multimedia (imágenes, documentos)
# IMPORTANTE: Esto solo funciona cuando DEBUG=True. 
# En producción, los archivos media deben ser servidos por Nginx, Apache o un CDN.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Opcional: También servir archivos estáticos (CSS, JS) en desarrollo si es necesario
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Configuración del título del panel administrativo (Personalización de marca)
admin.site.site_header = "Panel Administrativo EXPOMARKET"
admin.site.site_title = "EXPOMARKET Admin"
admin.site.index_title = "Bienvenido a la gestión de EXPOMARKET"




