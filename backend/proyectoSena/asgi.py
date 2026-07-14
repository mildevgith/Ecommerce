"""
ASGI config for proyectoSena project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os                                         # Importa el módulo del sistema operativo para interactuar con las variables de entorno.

from django.core.asgi import get_asgi_application # Importa la función de Django que levanta y construye la aplicación bajo el estándar ASGI.

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proyectoSena.settings') 
# Define por defecto qué archivo de configuración (settings.py) debe cargar el servidor asíncrono al iniciar el proyecto.

application = get_asgi_application()              # Ejecuta la función y expone la variable 'application', que es el punto de entrada que servidores como Daphne o Uvicorn usan para manejar conexiones asíncronas, en tiempo real o WebSockets.