import os
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings')

try:
    print("Forzando migraciones completas...")
    call_command('makemigrations', 'tienda')
    call_command('migrate', '--run-syncdb')
    print("Sincronización completada.")
except Exception as e:
    print(f"Error detallado en migraciones: {e}")

application = get_wsgi_application()
