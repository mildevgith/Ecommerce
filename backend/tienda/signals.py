from django.db.models.signals import post_save # Importo la señal "después de guardar" # Importa el evento nativo que se dispara automáticamente inmediatamente después de que un registro se guarda en la base de datos.
from django.contrib.auth.models import User # Importo el modelo de Usuario (el jefe) # Importa la tabla maestra de autenticación y credenciales de usuarios de Django.
from django.dispatch import receiver # Importo el "receptor" que escucha cuando algo pasa # Importa el decorador encargado de conectar una función específica con una señal emisora.
from .models import Profile # Importo el Perfil (donde guardamos WhatsApp, puntos, etc.) # Importa el modelo extendido encargado de almacenar los datos adicionales y de fidelidad de la cuenta.

# --- PRIMER REFLEJO: CREAR EL PERFIL ---
# Este receptor escucha al modelo User. Cuando se guarda un User, se activa.
@receiver(post_save, sender=User) # Vincula la función para que actúe como un receptor que se ejecuta siempre que el modelo User emita un evento de guardado.
def create_profile(sender, instance, created, **kwargs):
    # 'created' es un interruptor: solo es True la primera vez que se crea el usuario
    if created: # Evalúa el parámetro booleano; si es verdadero, significa que es un registro nuevo en la base de datos y no una actualización.
        # Si el usuario es nuevo, le creamos automáticamente su Perfil amarrado a él
        Profile.objects.create(user=instance) # Ejecuta una consulta SQL de inserción para instanciar y guardar un nuevo perfil enlazado a la ID del usuario creado.

# --- SEGUNDO REFLEJO: ACTUALIZAR EL PERFIL ---
# Este receptor asegura que si cambias algo en el User, el Perfil también se entere
@receiver(post_save, sender=User) # Configura un segundo punto de escucha sobre el modelo User para interceptar cualquier modificación en los datos de la cuenta.
def save_profile(sender, instance, **kwargs):
    # Guarda los cambios en el perfil del usuario actual
    instance.profile.save() # Accede mediante la relación inversa al objeto Perfil correspondiente y persiste los cambios para mantener los datos sincronizados.