from rest_framework import serializers
from .models import Profile, UserOTP
from .models import TiendaProducto, TiendaCliente, TiendaCategoria, TiendaCarrito, TiendaItemcarrito, TiendaPedido,  TiendaHistorialestadopedido, TiendaDetalleproducto


class TiendaProductoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaProducto
    fields = '__all__'

class TiendaClienteSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaCliente
    fields = '__all__'

class TiendaCategoriaSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaCategoria
    fields = '__all__'

class TiendaCarritoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaCarrito
    fields = '__all__'

class TiendaItemcarritoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaItemcarrito
    fields = '__all__'

class TiendaPedidoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaPedido
    fields = '__all__'

class DetalleProductoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaProducto
    fields = '__all__'

class TiendaHistorialestadopedidoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaHistorialestadopedido
    fields = '__all__'

class MetodoPagoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaPedido
    fields = ['id', 'metodo_pago']

class TiendaPagoSerializer(serializers.ModelSerializer):

  class Meta:
    model = TiendaPedido
    fields = '__all__'




class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOTP
        fields = ['otp_code', 'created_at'] # Por seguridad, no envíes el ID del usuario aquí





