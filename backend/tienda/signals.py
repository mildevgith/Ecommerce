from django.db.models.signals import post_save # Se activa después de guardar
from django.contrib.auth.models import User    # Escuchamos al modelo User
from django.dispatch import receiver           # El receptor de la señal
from .models import Profile                    # Importamos tu modelo Profile

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    # Si el usuario es nuevo (created es True)
    if created:
        # Creamos el perfil asociado a ese nuevo usuario
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    # Cada vez que se actualice el usuario, guardamos también el perfil
    instance.profile.save()
