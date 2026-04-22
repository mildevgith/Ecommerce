from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url

# Cargar variables de entorno
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
# Nunca dejes una clave por defecto aquí en producción
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("Falta la variable DJANGO_SECRET_KEY en el archivo .env")

DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 't')

# Configuración dinámica de hosts permitidos
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# --- APLICACIONES ---
INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Librerías de terceros
    'rest_framework',
    'corsheaders',
    'django.contrib.postgres', # Útil para campos específicos de Postgres
    # Apps del proyecto
    'tienda',
    
]

# --- MIDDLEWARE ---
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Debe ir lo más arriba posible
    'django.middleware.security.SecurityMiddleware',
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
# Si no hay DATABASE_URL en el .env, el sistema fallará (evita usar sqlite por error)
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        conn_health_checks=True, # Mejora la estabilidad de la conexión
    )
}

# --- LOCALIZACIÓN ---
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CONFIGURACIÓN DE CORS ---
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
CORS_ALLOW_CREDENTIALS = True

# --- DJANGO REST FRAMEWORK ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    # Opcional: Agregar permisos por defecto
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

# --- CONFIGURACIÓN DE EMAIL (Segura) ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS") # Sacado del código por seguridad
DEFAULT_FROM_EMAIL = f'EXPOMARKET <{EMAIL_HOST_USER}>'


# ==============================================================================
# CONFIGURACIÓN JAZZMIN RESPONSIVA Y CORPORATIVA (EXPOMARKET)
# ==============================================================================

JAZZMIN_SETTINGS = {
    "site_title": "EXPOMARKET Admin",
    "site_header": "EXPOMARKET",
    "site_brand": "EXPOMARKET",
    "site_logo": "tienda/img/logo.png",
    "site_logo_classes": "img-circle",
    "welcome_sign": "Gestión EXPOMARKET",
    "copyright": "EXPOMARKET S.A.S 2026",
    
    # --- AJUSTES DE RESPONSIVIDAD ---
    "show_sidebar": True,          # El menú se colapsa en móvil automáticamente
    "navigation_expanded": False,   # Al empezar colapsado, se ve mejor en pantallas pequeñas
    "compact_view": True,          # Reduce el espaciado para que quepa más info en el celular
    "icons_sidebar": True,         # Muestra iconos incluso cuando el menú está encogido
    
    # Buscador y enlaces rápidos
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
    # Estos ajustes hacen que la interfaz sea "limpia" en móviles
    "navbar_small_text": True,
    "footer_small_text": True,
    "body_small_text": True,      # Texto más pequeño para evitar scroll horizontal
    "brand_small_text": False,
    "sidebar_nav_small_text": True,
    "navbar": "navbar-dark",
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_flat_style": True,
    "theme": "flatly",            # Flatly es excelente para diseño responsivo
    "button_classes": {
        "primary": "btn-primary",
        "success": "btn-success"
    }
}