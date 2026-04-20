from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, UserOTP, TiendaProducto, TiendaCliente,
    TiendaCategoria, TiendaCarrito, TiendaItemcarrito,
    TiendaPedido, TiendaHistorialestadopedido, TiendaDetalleproducto
)

# 1. Serializer para el modelo User de Django (Necesario para el Perfil)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

# 2. Perfil de Usuario (Ahora incluye la información del User)
class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'whatsapp', 'puntos', 'direccion', 'img']

# 3. Productos (Incluye campos de oferta y destacados)
class TiendaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaProducto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'imagen', 'fecha_creacion', 'categoria', 'en_oferta',
            'precio_oferta', 'es_destacado', 'fin_oferta'
        ]

# 4. Clientes
class TiendaClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCliente
        fields = '__all__'

# 5. Categorías
class TiendaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCategoria
        fields = ['id', 'nombre', 'descripcion', 'imagen']

# 6. Carrito e Items
class TiendaCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCarrito
        fields = '__all__'

class TiendaItemcarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaItemcarrito
        producto_detalle = TiendaProductoSerializer(source='producto', read_only=True)
        fields = ['id', 'carrito', 'producto', 'cantidad', 'producto_detalle']

# 7. Pedidos e Historial
class TiendaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'

class TiendaHistorialestadopedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaHistorialestadopedido
        fields = '__all__'

# 8. Detalles Adicionales y Seguridad
class DetalleProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaProducto
        fields = '__all__'

class UserOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOTP
        fields = ['otp_code', 'created_at']

# 9. Pagos (Corregido: Apuntando a los campos correctos)
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = ['id', 'estado_actual'] # Ajustado según tus modelos de pedido

class TiendaPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'
