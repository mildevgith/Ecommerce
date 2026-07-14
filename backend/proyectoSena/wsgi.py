"""
WSGI config for proyectoSena project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os                                         # Importa el módulo del sistema operativo para gestionar variables de entorno.

from django.core.wsgi import get_wsgi_application # Importa la función de Django que levanta y construye la aplicación bajo el estándar WSGI.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings') 
# Define por defecto qué archivo de configuración (settings.py) debe cargar el servidor web al arrancar el proyecto.

application = get_wsgi_application()              # Ejecuta la función y expone la variable 'application', que es el punto de entrada que servidores como Gunicorn o Uwsgi usan para correr tu app en producción (Railway).