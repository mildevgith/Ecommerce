import os                                       # Importa el módulo del sistema operativo para gestionar variables de entorno.
from django.core.wsgi import get_wsgi_application # Importa la función de Django que levanta y construye la aplicación bajo el estándar WSGI.
from django.core.management import call_command # Importa el gestor para ejecutar comandos de Django por código (como migrate).

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings')
# Define por defecto qué archivo de configuración (settings.py) debe cargar el servidor web al arrancar el proyecto.

# Forzar la ejecución de migraciones en producción al iniciar la app
try:
    print("Ejecutando migraciones automáticas en producción...")
    call_command('migrate')
    print("Migraciones ejecutadas con éxito.")
except Exception as e:
    print(f"Error al ejecutar las migraciones automáticamente: {e}")

application = get_wsgi_application()              # Ejecuta la función y expone la variable 'application', que es el punto de entrada que servidores como Gunicorn usan para correr tu app en producción.

# Creación automática de superusuario en producción
from django.contrib.auth import get_user_model

if not os.environ.get('DEBUG', False):
    try:
        User = get_user_model()
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@admin.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Admin12345*')

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            print(f"Superusuario '{username}' creado exitosamente.")
    except Exception as e:
        print(f"No se pudo crear el superusuario automáticamente: {e}")
