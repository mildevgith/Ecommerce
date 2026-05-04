from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve # <--- Importante para producción
import re

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tienda.urls')),
]

# Manejo de archivos tanto para desarrollo como para producción (Railway)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    # Esta ruta permite que Railway sirva los archivos estáticos si WhiteNoise tiene problemas
    urlpatterns += [
        path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
        path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]

admin.site.site_header = "Panel Administrativo EXPOMARKET"
admin.site.site_title = "EXPOMARKET Admin"
admin.site.index_title = "Bienvenido a la gestión de EXPOMARKET"