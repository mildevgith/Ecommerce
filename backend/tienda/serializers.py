from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, UserOTP, TiendaProducto, TiendaCliente,
    TiendaCategoria, TiendaCarrito, TiendaItemcarrito,
    TiendaPedido, TiendaHistorialestadopedido, TiendaDetalleproducto,
    TiendaBanner, TiendaPago, Receta
)


class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'whatsapp', 'puntos', 'direccion', 'img']

class TiendaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaProducto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'imagen', 'fecha_creacion', 'categoria', 'en_oferta',
            'precio_oferta', 'es_destacado', 'fin_oferta'
        ]

class TiendaClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCliente
        fields = '__all__'

class TiendaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCategoria
        fields = ['id', 'nombre', 'slug', 'descripcion', 'imagen']

class TiendaCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCarrito
        fields = '__all__'

class TiendaItemcarritoSerializer(serializers.ModelSerializer):
    producto_detalle = TiendaProductoSerializer(source='producto', read_only=True)
    class Meta:
        model = TiendaItemcarrito
        fields = ['id', 'carrito', 'producto', 'cantidad', 'producto_detalle']

class TiendaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'

class TiendaHistorialestadopedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaHistorialestadopedido
        fields = '__all__'

class UserOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOTP
        fields = ['otp_code', 'created_at']

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = ['id', 'estado_actual']

class TiendaPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'

class TiendaBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaBanner
        fields = '__all__'
