from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import os

urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/', include('tienda.urls')),
    path('admin/', admin.site.urls),        # Define la ruta principal para acceder al panel de control de Django Jazzmin.
    path('api/', include('tienda.urls'))  # Redirecciona e incluye todas las sub-rutas de la API creadas dentro de tu app 'tienda'.

]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
else:
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]

admin.site.site_header = "Panel Administrativo EXPOMARKET"
admin.site.site_title = "EXPOMARKET Admin"
admin.site.index_title = "Bienvenido a la gestión de EXPOMARKET"
