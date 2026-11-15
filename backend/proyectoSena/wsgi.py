import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command
from django.contrib.auth import get_user_model

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings')

try:
    print("Iniciando sincronización de base de datos...")
    call_command('migrate', 'tienda', fake=True)
    call_command('migrate')                       
    print("Sincronización de base de datos finalizada.")
except Exception as e:
    print(f"Error en la sincronización automática: {e}")

application = get_wsgi_application()


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
