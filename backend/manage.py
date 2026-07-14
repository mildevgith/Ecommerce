#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    # 1. CONFIGURACIÓN DEL ENTORNO:
    # Le indica a Django dónde encontrar tus configuraciones (settings.py)
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings')
    
    # 2. VALIDACIÓN DE INSTALACIÓN:
    # Intenta importar el ejecutor de comandos de Django; si falla, es porque no instalaste Django
    # o no activaste tu entorno virtual (venv).
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
        
    # 3. EJECUCIÓN:
    # Toma los comandos que escribes en la terminal (ej: 'python manage.py runserver')
    # y los traduce a acciones reales dentro de tu proyecto.
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()