import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings')
django.setup()

from django.core.management import call_command

print("--- EJECUTANDO MIGRACIONES FORZADAS ---")
try:
    call_command('migrate', 'tienda', '--fake-initial')
    call_command('migrate')
    print("--- MIGRACIONES COMPLETADAS CON ÉXITO ---")
except Exception as e:
    print(f"Error en migraciones: {e}")
