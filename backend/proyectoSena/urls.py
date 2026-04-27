from django.contrib import admin  # Traigo la herramienta para el panel de control
from django.urls import path, include  # 'path' para rutas fijas e 'include' para traer rutas de otras apps
from django.conf import settings  # Para poder leer lo que configuramos en settings.py
from django.conf.urls.static import static  # Para que Django sepa mostrar las fotos de los productos

# Aquí dibujo el mapa principal de mi web
urlpatterns = [
    # Si escribo /admin, entro al panel de control de Jazzmin que ya configuramos
    path('admin/', admin.site.urls),

    # Si la petición empieza con /api/, le paso la bola a las URLs de mi app 'tienda'
    # Es como decirle: "Si buscan comida, hablen con el chef de la sección Tienda"
    path('api/', include('tienda.urls')),
]

# --- MANEJO DE FOTOS (SOLO PARA MI COMPU) ---
# Si estoy trabajando en mi PC (DEBUG=True), dejo que Django se encargue de mostrar las imágenes
# En una web real, esto lo haría un servidor de archivos más potente
if settings.DEBUG:
    # Ruta para las fotos de los mariscos (Media)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Ruta para el diseño, CSS y logos (Static)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# --- PERSONALIZACIÓN DEL PANEL ---
# Aquí cambio los textos por defecto de Django por el nombre de mi marca: EXPOMARKET
admin.site.site_header = "Panel Administrativo EXPOMARKET"
admin.site.site_title = "EXPOMARKET Admin"
admin.site.index_title = "Bienvenido a la gestión de EXPOMARKET"
