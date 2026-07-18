from pathlib import Path       # Manejo de rutas de archivos de forma compatible entre Windows y Linux.
import os                      # Permite interactuar con el sistema operativo y leer variables de entorno.
import dj_database_url         # Parsea cadenas de conexión URL para configurar bases de datos (clave para Railway).
from dotenv import load_dotenv # Carga las variables secretas desde un archivo local '.env'.


load_dotenv()                                     # Activa la lectura de las variables de entorno guardadas en el archivo '.env'.

BASE_DIR = Path(__file__).resolve().parent.parent # Encuentra la carpeta principal del proyecto (backend).

# --- SEGURIDAD ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "m4lmxu#if!t&mc=^(&y+7a8ojrt3%!qmw7edgc=a6#$+f%h_v")
 
# Firma criptográfica de Django; usa una variable segura o un texto por defecto si estás en local.

DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 't') 
# Apaga el modo de depuración en producción si la variable detecta 'False' para no mostrar errores a clientes.

# Permitimos el localhost y también el dominio que nos asigne Railway
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost,.railway.app").split(",") 
# Lista de dominios e IPs web autorizadas para servir la aplicación.

# --- APLICACIONES ---
INSTALLED_APPS = [
    'jazzmin',                           # Interfaz visual premium para el panel de administración.
    'django.contrib.admin',              # Panel de administración nativo de Django.
    'django.contrib.auth',               # Sistema de autenticación (usuarios y grupos).
    'django.contrib.contenttypes',       # Sistema de permisos ligado a los modelos de datos.
    'django.contrib.sessions',           # Manejo de sesiones de usuario del servidor.
    'django.contrib.messages',           # Sistema de notificaciones emergentes (alerts).
    'whitenoise.runserver_nostatic',     # Desactiva el manejo nativo de estáticos en desarrollo a favor de WhiteNoise.
    'django.contrib.staticfiles',        # Gestión base de archivos estáticos (CSS, JS, imágenes).
    'rest_framework',                    # Framework para construir la API REST que consume React.
    'corsheaders',                       # Permite peticiones HTTP de origen cruzado (necesario para React/Netlify).
    'django.contrib.postgres',           # Soporte para tipos de datos avanzados de PostgreSQL.
    'cloudinary',                        # Conector para guardar imágenes en la nube de Cloudinary.
    'tienda',                            # Tu aplicación local con la lógica de negocio, productos y pedidos.
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',      # Intercepta y autoriza las reglas de conexión entre dominios (CORS).
    'django.middleware.security.SecurityMiddleware', # Añade capas estándar de seguridad web (XSS, redirecciones).
    'whitenoise.middleware.WhiteNoiseMiddleware', # Sirve y comprime archivos CSS/JS eficientemente en la nube.
    'django.contrib.sessions.middleware.SessionMiddleware', # Gestiona el estado de sesión de los usuarios entre peticiones.
    'django.middleware.common.CommonMiddleware',     # Maneja reglas comunes como reescritura de URLs y barras finales.
    'django.middleware.csrf.CsrfViewMiddleware',     # Protege los formularios contra ataques maliciosos de falsificación (CSRF).
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Asocia al usuario logueado con cada petición HTTP recibida.
    'django.contrib.messages.middleware.MessageMiddleware', # Maneja los mensajes temporales de la sesión.
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Evita que tu web sea embebida dentro de frames o iframes externos.
]

ROOT_URLCONF = 'proyectoSena.urls' # Define el archivo maestro donde se encuentran las rutas de URL del backend.

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates', # Motor HTML nativo de Django.
        'DIRS': [],                                                   # Carpetas globales adicionales para HTMLs.
        'APP_DIRS': True,                                             # Indica a Django buscar HTMLs dentro de las apps.
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',           # Pasa datos de depuración a los HTML.
                'django.template.context_processors.request',         # Permite acceder al objeto HTTP 'request' en los HTML.
                'django.contrib.auth.context_processors.auth',        # Permite saber qué usuario está logueado dentro del HTML.
                'django.contrib.messages.context_processors.messages',# Carga los mensajes emergentes disponibles en el HTML.
            ],
        },
    },
]

# --- BASE DE DATOS ---
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,         # Mantiene la conexión abierta 10 minutos para ahorrar recursos.
        conn_health_checks=True,  # Verifica si la base de datos sigue viva antes de cada consulta.
    )
}

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = '/static/'                  # Ruta web desde donde se accede a los archivos estáticos.
STATIC_ROOT = BASE_DIR / 'staticfiles'   # Carpeta donde se compilarán los estáticos para producción.

STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage' 
# Configura WhiteNoise para comprimir (gzip) y cachear los archivos CSS/JS.

STATICFILES_DIRS = []                    # Lista de carpetas de origen de archivos estáticos.
local_static = BASE_DIR / 'static'       # Localiza tu carpeta 'static/' local de desarrollo.
if local_static.exists():
    STATICFILES_DIRS.append(str(local_static)) # Vincula la carpeta local si existe para que Django la lea.

if not STATIC_ROOT.exists():
    STATIC_ROOT.mkdir(parents=True, exist_ok=True) # Crea automáticamente la carpeta de compilación si no existe.

MEDIA_URL = '/media/'                    # URL pública para acceder a los archivos subidos por usuarios (productos).
MEDIA_ROOT = BASE_DIR / 'media'          # Carpeta local física donde se procesan los archivos multimedia.

# --- CONFIGURACIÓN DE CORS Y CSRF ---
CORS_ALLOWED_ORIGINS = [
  "https://expomarket-pescados-mariscos.netlify.app", # URL del frontend en producción autorizada.
  "http://localhost:5173",                            # URL de React local autorizada para desarrollo.
]
CORS_ALLOW_CREDENTIALS = True # Permite que el frontend envíe cookies y credenciales de autenticación.

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173", # Origen de confianza para formularios locales.
    "http://127.0.0.1:5173", # Alternativa local de confianza.
    "https://serene-peace-production-62ee.up.railway.app" # URL de tu backend en Railway para solicitudes seguras.
]

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication', # Autenticación mediante sesiones del navegador.
        'rest_framework.authentication.BasicAuthentication',   # Autenticación básica mediante cabeceras HTTP.
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', # Permite acceso público por defecto a los endpoints de la API.
    ]
}

# --- CONFIGURACIÓN DE EMAIL ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' # Driver para envío de correos vía protocolo SMTP.
EMAIL_HOST = 'smtp.gmail.com'                                # Servidor de salida de correos de Google.
EMAIL_PORT = 587                                             # Puerto de conexión seguro para TLS.
EMAIL_USE_TLS = True                                         # Activa el cifrado de seguridad TLS.
EMAIL_HOST_USER = os.getenv("EMAIL_USER")                    # Cuenta de Gmail corporativa desde las variables ocultas.
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS")                # Contraseña de aplicación proveída por Google.
DEFAULT_FROM_EMAIL = f'EXPOMARKET <{EMAIL_HOST_USER}>'       # Nombre y correo remitente por defecto que verá el cliente.

# ==========================================
# CONFIGURACIÓN PRINCIPAL DE JAZZMIN
# ==========================================
JAZZMIN_SETTINGS = {
    "site_logo": "admin/img/logo.png",        # Logo circular de la esquina superior izquierda.
    "login_logo": "admin/img/slogan.png",     # Logo grande para la pantalla de inicio de sesión.
    "site_icon": "admin/img/favicon.jpeg",    # Icono pequeño (favicon) de la pestaña del navegador.
    "site_brand": "EXPOMAR",                  # Identificador de marca (el CSS ocultará este texto para usar la imagen).
    "custom_css": "admin/css/expomarket_admin.css", # Ruta de tu archivo CSS personalizado con el tema del océano.
    "site_title": "Expomarket | Operaciones", # Título que se lee en la pestaña del navegador.
    "site_header": "Expomarket",              # Título de respaldo para accesibilidad.
    "welcome_sign": "Pescados y Mariscos Premium", # Texto de bienvenida en el Login.
    "copyright": "Expomarket Grupo GRB",      # Firma al pie de página del panel de control.
    "search_model": ["tienda.Producto"],      # Habilita un buscador directo de productos en la barra superior.

    # --- Menú Superior (Navbar) ---
    "topmenu_links": [
        {"name": "Panel Principal", "url": "admin:index", "permissions": ["auth.view_user"]}, # Enlace al inicio del admin.
        {"name": "Ver Tienda Virtual 🛒", "url": "http://localhost:5173", "new_window": True}, # Abre tu React en pestaña nueva.
    ],
    
    # --- Comportamiento Barra Lateral ---
    "show_sidebar": True,          # Muestra el árbol de aplicaciones a la izquierda.
    "navigation_expanded": True,   # Mantiene los menús desplegados automáticamente.

    # --- Iconografía de Modelos (Font Awesome) ---
    "icons": {
        "auth": "fas fa-shield-alt",                  # Escudo para seguridad.
        "auth.user": "fas fa-user-lock",              # Candado para administración de usuarios.
        "auth.Group": "fas fa-users",                 # Grupo de usuarios.
        "tienda.profile": "fas fa-user-circle",       # Icono de usuario para perfiles.
        "tienda.tiendacarrito": "fas fa-shopping-cart", # Icono de carrito para compras.
        "tienda.tiendacategoria": "fas fa-th-large",  # Cuadrícula para categorías.
        "tienda.tiendacliente": "fas fa-user-check",  # Usuario verificado para clientes.
        "tienda.tiendacupondescuento": "fas fa-ticket-alt", # Ticket de descuento.
        "tienda.tiendadetallepedido": "fas fa-search-plus", # Lupa para examinar detalles de compra.
        "tienda.tiendadetalleproducto": "fas fa-list-alt", # Formato de lista para detalles de producto.
        "tienda.tiendahistorialestadopedido": "fas fa-route", # Mapa de ruta para estados del pedido.
        "tienda.tiendainventario": "fas fa-boxes",    # Cajas para stock.
        "tienda.tiendaitemcarrito": "fas fa-cart-plus", # Añadir al carrito.
        "tienda.tiendametodopago": "fas fa-credit-card", # Tarjeta de crédito.
        "tienda.tiendapago": "fas fa-check-circle",   # Círculo de verificación para pagos aprobados.
        "tienda.tiendapedido": "fas fa-truck-loading", # Montacargas para envíos y logística.
        "tienda.tiendaproducto": "fas fa-fish",       # Icono de pescado para tus productos marinos.
        "tienda.tiendaresenaproducto": "fas fa-comments-dollar", # Icono de comentarios de valoraciones.
    },
    
    "changeform_format": "horizontal_tabs", # Muestra los formularios de edición organizados en pestañas limpias.
}

# ==========================================
# RETOQUES VISUALES Y COLORES (UI TWEAKS)
# ==========================================
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,       # Mantiene la tipografía superior en tamaño legible.
    "footer_small_text": True,        # Letra pequeña y discreta al pie de página.
    "body_small_text": False,         # Tamaño estándar de texto de lectura.
    "brand_small_text": False,        # Mantiene el logo en dimensiones destacadas.
    "navbar": "navbar-dark bg-dark",  # Estilo de barra superior negra elegante.
    "no_navbar_border": True,         # Quita líneas divisoras molestas en el navbar.
    "navbar_fixed": True,             # Congela la barra de arriba al hacer scroll hacia abajo.
    "sidebar_fixed": True,            # Deja el menú izquierdo fijo mientras navegas por datos extensos.
    "sidebar": "sidebar-dark-primary", # Combinación de colores oscuros para el menú de la izquierda.
    "sidebar_nav_small_text": False,  # Tipografía normal para las aplicaciones del menú.
    "sidebar_nav_flat_style": True,   # Diseño de botones laterales plano sin relieves anticuados.
    "theme": "navy",                  # Paleta náutica azulada base proporcionada por AdminLTE.
    "dark_mode_theme": None,          # Desactiva el interruptor automático de modo oscuro para usar tu CSS propio.
    "button_classes": {
        "primary": "btn-expomarket",  # Aplica tu clase CSS con gradiente naranja a los botones de acción principales.
        "secondary": "btn-outline-light" # Estilo blanco calado para botones secundarios.
    },
    "actions_sticky": True            # Clava los botones de guardar formularios siempre visibles en la base de la pantalla.
}

# --- CONFIGURACIÓN DE ALMACENAMIENTO ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'), # Nombre de tu espacio de trabajo de Cloudinary.
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),       # Credencial pública de conexión.
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'), # Credencial secreta y privada de conexión.
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage' 
# Sobreescribe el sistema de archivos local para enviar directamente todas las fotos multimedia (mariscos) a Cloudinary.