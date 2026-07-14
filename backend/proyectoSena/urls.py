from django.contrib import admin            # Importa el módulo nativo de Django para gestionar el panel de administración.
from django.urls import path, include, re_path # Importa funciones para definir rutas fijas (path), incluir otras URLs (include) y usar expresiones regulares (re_path).
from django.conf import settings            # Importa el acceso global a tu archivo 'settings.py' para leer configuraciones.
from django.conf.urls.static import static  # Importa la función auxiliar para servir archivos estáticos/media en modo desarrollo.
from django.views.static import serve       # Importa la vista interna de Django que lee y sirve archivos directamente desde el disco duro.
import os                                   # Importa el módulo del sistema operativo (disponible por si se requiere mapear rutas).

urlpatterns = [
    path('admin/', admin.site.urls),        # Define la ruta principal para acceder al panel de control de Django Jazzmin.
    path('api/', include('tienda.urls')),   # Redirecciona e incluye todas las sub-rutas de la API creadas dentro de tu app 'tienda'.
]

# Manejo de archivos para Desarrollo y Producción
if settings.DEBUG:                          # Condicional: si el modo depuración está encendido (entorno de desarrollo local).
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)   # Añade la ruta para servir las fotos de productos subidas en local.
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Añade la ruta para servir los archivos CSS, JS y logos en local.
else:                                       # Condicional: si está en producción (modo simulación o despliegue en la nube como Railway).
    # Usamos re_path para las rutas complejas en Railway, así evitamos los warnings de tu imagen
    urlpatterns += [
        re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}), # Usa expresiones regulares para buscar y servir los archivos de estilos finales desde la carpeta estática compilada.
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),   # Usa expresiones regulares para buscar y servir las imágenes en producción si Cloudinary no las cubre.
    ]

# Personalización del panel
admin.site.site_header = "Panel Administrativo EXPOMARKET"       # Cambia el título principal de la barra de herramientas del admin clásico.
admin.site.site_title = "EXPOMARKET Admin"                       # Cambia el texto secundario o metatítulo de la pestaña de administración.
admin.site.index_title = "Bienvenido a la gestión de EXPOMARKET" # Modifica el saludo inicial de bienvenida en la cabecera del Dashboard principal.