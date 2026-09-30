from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "m4lmxu#if!t&mc=^(&y+7a8ojrt3%!qmw7edgc=a6#$+f%h_v")

DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 't')

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost,.onrender.com").split(",")

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
    'whitenoise.middleware.WhiteNoiseMiddleware',
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

# --- BASE DE DATOS (Supabase / Local) ---
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
}

if not DATABASES['default']:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

STATICFILES_DIRS = []
local_static = BASE_DIR / 'static'
if local_static.exists():
    STATICFILES_DIRS.append(str(local_static))

if not STATIC_ROOT.exists():
    STATIC_ROOT.mkdir(parents=True, exist_ok=True)

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

CORS_ALLOW_ALL_ORIGINS = True

# --- CONFIGURACIÓN DE CORS Y CSRF (Render + Vercel + Local) ---
CORS_ALLOWED_ORIGINS = [
    "https://ecommerce-expomar-12.vercel.app",
    "https://expomarket-pescados-mariscos.netlify.app",
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ecommerce-dsr6.onrender.com",
    "https://ecommerce-expomar-12.vercel.app"
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
    "site_logo": "admin/img/logo.png",
    "login_logo": "admin/img/slogan.png",
    "site_icon": "admin/img/favicon.jpeg",
    "site_brand": "EXPOMAR",
    "custom_css": "admin/css/expomarket_admin.css",
    "site_title": "Expomarket | Operaciones",
    "site_header": "Expomarket",
    "welcome_sign": "Pescados y Mariscos Premium",
    "copyright": "Expomarket Grupo GRB",
    "search_model": ["tienda.Producto"],

    "topmenu_links": [
        {"name": "Panel Principal", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Ver Tienda Virtual 🛒", "url": "https://ecommerce-expomar-12.vercel.app", "new_window": True},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,

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
        "tienda.tiendaproducto": "fas fa-fish",
        "tienda.tiendaresenaproducto": "fas fa-comments-dollar",
    },

    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": True,
    "body_small_text": False,
    "brand_small_text": False,
    "navbar": "navbar-dark bg-dark",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_nav_flat_style": True,
    "theme": "navy",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-expomarket",
        "secondary": "btn-outline-light"
    },
    "actions_sticky": True
}

# --- CONFIGURACIÓN DE ALMACENAMIENTO (Cloudinary) ---
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

