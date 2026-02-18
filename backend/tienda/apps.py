from django.apps import AppConfig

class TiendaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tienda'

    def ready(self):
        # Esto le dice a Django que importe las señales cuando la app inicie
        import tienda.signals
