from django.db.models.signals import post_save # Importo la señal "después de guardar"
from django.contrib.auth.models import User # Importo el modelo de Usuario (el jefe)
from django.dispatch import receiver # Importo el "receptor" que escucha cuando algo pasa
from .models import Profile # Importo el Perfil (donde guardamos WhatsApp, puntos, etc.)

# --- PRIMER REFLEJO: CREAR EL PERFIL ---
# Este receptor escucha al modelo User. Cuando se guarda un User, se activa.
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    # 'created' es un interruptor: solo es True la primera vez que se crea el usuario
    if created:
        # Si el usuario es nuevo, le creamos automáticamente su Perfil amarrado a él
        Profile.objects.create(user=instance)

# --- SEGUNDO REFLEJO: ACTUALIZAR EL PERFIL ---
# Este receptor asegura que si cambias algo en el User, el Perfil también se entere
@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    # Guarda los cambios en el perfil del usuario actual
    instance.profile.save()
