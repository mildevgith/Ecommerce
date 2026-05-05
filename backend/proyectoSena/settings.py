from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Directorio raíz del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "django-insecure-default-key-123")

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

# --- JAZZMIN SETTINGS ---
JAZZMIN_SETTINGS = {
    "site_title": "EXPOMARKET Admin",
    "site_header": "EXPOMARKET",
    "site_brand": "EXPOMARKET",
    "site_logo": "tienda/img/logo.png",
    "site_logo_classes": "img-circle",
    "welcome_sign": "Gestión EXPOMARKET",
    "copyright": "EXPOMARKET S.A.S 2026",
    "show_sidebar": True,
    "navigation_expanded": False,
    "compact_view": True,
    "icons_sidebar": True,
    "search_model": ["tienda.TiendaProducto"],
    "topmenu_links": [
        {"name": "Inicio", "url": "admin:index"},
        {"name": "Web", "url": "http://localhost:5173", "new_window": True},
    ],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-user-shield",
        "tienda.TiendaProducto": "fas fa-box",
        "tienda.TiendaCategorias": "fas fa-tags",
    },
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": True,
    "footer_small_text": True,
    "body_small_text": True,
    "brand_small_text": False,
    "sidebar_nav_small_text": True,
    "navbar": "navbar-dark",
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_flat_style": True,
    "theme": "flatly",
    "button_classes": {
        "primary": "btn-primary",
        "success": "btn-success"
    }
}


# --- CONFIGURACIÓN DE ALMACENAMIENTO ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET')
}

# Esto le dice a Django que use Cloudinary para los archivos MEDIA
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'