from pathlib import Path  # Importo esta herramienta para manejar rutas de carpetas de forma fácil
import os  # Importo os para poder leer variables del sistema (como las del .env)
from dotenv import load_dotenv  # Esta librería sirve para que Python pueda leer mi archivo .env
import dj_database_url  # Herramienta clave para conectar la base de datos usando una sola URL

load_dotenv()  # ¡Ojo! Aquí le digo al sistema: "Busca el archivo .env y carga todo lo que hay dentro"

# Aquí defino dónde está la raíz de mi proyecto para no perderme en las carpetas
BASE_DIR = Path(__file__).resolve().parent.parent

# --- SEGURIDAD ---
# Busco la llave secreta en el .env; si no está, el programa se detiene con un error
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("Falta la variable DJANGO_SECRET_KEY en el archivo .env")

# Configuro el modo depuración: si en el .env dice 'true', veré errores detallados
DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 't')

# Defino quién puede entrar a mi servidor; por ahora, mi propia compu (localhost)
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

# --- APLICACIONES ---
# Aquí anoto todas las piezas que forman mi web, incluyendo 'tienda' que es mi código propio
INSTALLED_APPS = [
    'jazzmin',  # El diseño para el panel de administrador
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',  # Para crear la API que se comunica con React
    'corsheaders',  # Para que React (puerto 5173) y Django (puerto 8000) se lleven bien
    'django.contrib.postgres',  # Herramientas para mi base de datos PostgreSQL
    'tienda',  # Mi aplicación principal de productos y usuarios
]

# --- MIDDLEWARE ---
# Son como "guardias" que revisan cada petición que llega a la web antes de procesarla
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # El guardia que permite el paso a React (debe ir de primero)
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'proyectoSena.urls'  # Le digo a Django dónde está el mapa principal de mis rutas/URLs

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
# Aquí configuro la conexión mágica: dj_database_url lee la URL del .env y conecta Postgres o SQLite
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,  # Mantengo la conexión abierta 10 min para que sea más rápido
        conn_health_checks=True,  # Reviso que la base de datos esté "viva" antes de usarla
    )
}

# --- LOCALIZACIÓN ---
# Configuro el idioma a español de Colombia y la hora de Bogotá
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# --- ARCHIVOS ESTÁTICOS Y MEDIA ---
STATIC_URL = 'static/'  # Cómo se verán las URLs de mis archivos CSS o imágenes fijas
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # Carpeta donde se guardará todo al publicar la web
MEDIA_URL = '/media/'  # URL para las fotos de los mariscos que yo suba
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # Carpeta real en mi PC donde se guardan esas fotos

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- CONFIGURACIÓN DE CORS Y CSRF ---
# Le doy permiso explícito al puerto de React para que me pida datos
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True  # Permito que viajen las cookies y sesiones

# Confío en React para que me envíe el token de seguridad (CSRF)
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# --- DJANGO REST FRAMEWORK ---
# Configuro cómo React se va a identificar conmigo (por sesión o login básico)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Por ahora, dejo que cualquiera vea los productos
    ]
}

# --- CONFIGURACIÓN DE EMAIL ---
# Aquí configuro el "cartero" de Gmail para enviar correos de recuperación de clave
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True  # Uso conexión segura
EMAIL_HOST_USER = os.getenv("EMAIL_USER")  # Mi correo de Gmail (sacado del .env)
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASS")  # Mi clave de aplicación (sacada del .env)
DEFAULT_FROM_EMAIL = f'EXPOMARKET <{EMAIL_HOST_USER}>'

# --- JAZZMIN SETTINGS ---
# Todo esto es puro "maquillaje" para que mi panel de administrador se vea profesional y con mi logo
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

# Configuración de colores y estilo visual del admin
JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": True,
    "footer_small_text": True,
    "body_small_text": True,
    "brand_small_text": False,
    "sidebar_nav_small_text": True,
    "navbar": "navbar-dark",
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_flat_style": True,
    "theme": "flatly",  # El tema visual "Flatly" que es limpio y profesional
    "button_classes": {
        "primary": "btn-primary",
        "success": "btn-success"
    }
}
