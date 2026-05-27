from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Directorio raíz del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "m4lmxu#if!t&mc=^(&y+7a8ojrt3%!qmw7edgc=a6#$+f%h_v")

DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 't')

# Permitimos el localhost y también el dominio que nos asigne Railway
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost,.railway.app").split(",")

# --- APLICACIONES ---
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django.contrib.postgres',
    'cloudinary',
    'tienda',
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # CRÍTICO: Debe ir después de SecurityMiddleware
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'proyectoSena.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# --- BASE DE DATOS ---
# Configuración optimizada para Railway
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Usamos el almacenamiento más robusto para evitar errores de directorio
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Evitamos el error naranja (W004) validando la carpeta 'static' local
STATICFILES_DIRS = []
local_static = BASE_DIR / 'static'
if local_static.exists():
    STATICFILES_DIRS.append(str(local_static))

# FORZAR CREACIÓN: Esto elimina el error "No directory at: /app/staticfiles/"
if not STATIC_ROOT.exists():
    STATIC_ROOT.mkdir(parents=True, exist_ok=True)

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'





# --- CONFIGURACIÓN DE CORS Y CSRF ---
CORS_ALLOWED_ORIGINS = [
  "https://expomarket-pescados-mariscos.netlify.app",
  "http://localhost:5173",  # Para que puedas seguir probando en tu PC
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://serene-peace-production-62ee.up.railway.app"
]

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

# --- CONFIGURACIÓN DE EMAIL ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS")
DEFAULT_FROM_EMAIL = f'EXPOMARKET <{EMAIL_HOST_USER}>'




# ==========================================
# CONFIGURACIÓN PRINCIPAL DE JAZZMIN
# ==========================================
JAZZMIN_SETTINGS = {

    
    # --- RUTAS DE IMÁGENES CORREGIDAS ---
    "site_logo": "admin/img/logo.png",        # Apunta a la carpeta de imágenes, NO a css
    "login_logo": "admin/img/slogan.png",       
    
    # Texto que el CSS va a ocultar para inyectar el logo de texto
    "site_brand": "EXPOMAR",                           
    
    # Tu archivo CSS que sí está en admin/css/
    "custom_css": "admin/css/expomarket_admin.css",                           # Texto base obligatorio que el CSS cambiará por el logo de texto
    
    # --- Títulos del Panel ---
    "site_title": "Expomarket | Operaciones",          # Título de la pestaña de navegación
    "site_header": "Expomarket",                       # Encabezado estándar
    "welcome_sign": "Pescados y Mariscos Premium",     # Eslogan en la pantalla de acceso
    "copyright": "Expomarket Grupo GRB",               # Derechos de autor en el pie de página
    "search_model": ["tienda.Producto"],               # Buscador global en el panel superior

    # --- Menú Superior (Navbar) ---
    "topmenu_links": [
        {"name": "Panel Principal", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Ver Tienda Virtual 🛒", "url": "http://localhost:5173", "new_window": True},
    ],
    
    # --- Comportamiento Barra Lateral ---
    "show_sidebar": True,                              # Muestra la barra de navegación lateral
    "navigation_expanded": True,                       # Aplicaciones desplegadas por defecto

    # --- Iconografía de Modelos (Font Awesome) ---
    "icons": {
        "auth": "fas fa-shield-alt",
        "auth.user": "fas fa-user-lock",
        "auth.Group": "fas fa-users",
        
        "tienda.profile": "fas fa-user-circle",
        "tienda.tiendacarrito": "fas fa-shopping-cart",
        "tienda.tiendacategoria": "fas fa-th-large",
        "tienda.tiendacliente": "fas fa-user-check",
        "tienda.tiendacupondescuento": "fas fa-ticket-alt",
        "tienda.tiendadetallepedido": "fas fa-search-plus",
        "tienda.tiendadetalleproducto": "fas fa-list-alt",
        "tienda.tiendahistorialestadopedido": "fas fa-route",
        "tienda.tiendainventario": "fas fa-boxes",
        "tienda.tiendaitemcarrito": "fas fa-cart-plus",
        "tienda.tiendametodopago": "fas fa-credit-card",
        "tienda.tiendapago": "fas fa-check-circle",
        "tienda.tiendapedido": "fas fa-truck-loading",
        "tienda.tiendaproducto": "fas fa-fish",          # Icono de pescado para tus productos marinos
        "tienda.tiendaresenaproducto": "fas fa-comments-dollar",
    },
    
    # --- Interfaz de Formularios ---
    "changeform_format": "horizontal_tabs",            # Formularios extensos ordenados en pestañas hórreos
    
    # --- Archivo de Diseño Vinculado ---
    "custom_css": "admin/css/expomarket_admin.css",    # Enlace directo a tus estilos del océano
}

# ==========================================
# RETOQUES VISUALES Y COLORES (UI TWEAKS)
# ==========================================
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": True,
    "body_small_text": False,
    "brand_small_text": False,

    "navbar": "navbar-dark bg-dark",                   # Encabezado superior oscuro
    "no_navbar_border": True,
    "navbar_fixed": True,
    "sidebar_fixed": True,

    "sidebar": "sidebar-dark-primary",                 # Menú izquierdo oscuro
    "sidebar_nav_small_text": False,
    "sidebar_nav_flat_style": True,                    # Estilo plano sin relieves viejos

    "theme": "navy",                                   # Paleta náutica base
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-expomarket",                   # Botones con gradiente naranja
        "secondary": "btn-outline-light"
    },
    
    "actions_sticky": True                             # Barra de herramientas fija al pie de página
}




# --- CONFIGURACIÓN DE ALMACENAMIENTO ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

# Esto le dice a Django que use Cloudinary para los archivos MEDIA
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'