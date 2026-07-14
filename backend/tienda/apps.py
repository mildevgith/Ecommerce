from django.apps import AppConfig  # Importa la clase base de Django para gestionar la configuración y el ciclo de vida de una aplicación.

class TiendaConfig(AppConfig):     # Define la clase de configuración específica para tu módulo o aplicación llamada 'tienda'.
    default_auto_field = 'django.db.models.BigAutoField' # Configura por defecto que las llaves primarias implícitas (IDs) sean de tipo entero grande (64 bits).
    name = 'tienda'                # Especifica la ruta de importación completa de Python para identificar esta aplicación dentro del proyecto.

    def ready(self):               # Método especial de Django que se ejecuta automáticamente de forma exacta en el momento en que el servidor termina de cargar la aplicación.
        import tienda.signals      # Importa y activa el archivo de señales (signals) para que el backend escuche eventos automáticos (como crear perfiles al registrar usuarios).