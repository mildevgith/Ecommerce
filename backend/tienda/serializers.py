from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Profile, UserOTP, TiendaProducto, TiendaCliente,
    TiendaCategoria, TiendaCarrito, TiendaItemcarrito,
    TiendaPedido, TiendaHistorialestadopedido, TiendaDetalleproducto
)

# 1. TRADUCTOR DE USUARIO: Convierte los datos básicos de Django (ID, email) a JSON
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']

# 2. TRADUCTOR DE PERFIL: Muy importante para que el Navbar muestre el nombre del usuario logueado
class ProfileSerializer(serializers.ModelSerializer):
    # Meto el UserSerializer adentro para que cuando React pida el perfil,
    # también le llegue el email y el username del usuario.
    user = UserSerializer(read_only=True)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'whatsapp', 'puntos', 'direccion', 'img']

# 3. TRADUCTOR DE PRODUCTOS: Pasa toda la info del pescado a React (precios, ofertas, etc.)
class TiendaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaProducto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'imagen', 'fecha_creacion', 'categoria', 'en_oferta',
            'precio_oferta', 'es_destacado', 'fin_oferta'
        ]

# 4. TRADUCTOR DE CLIENTES: Convierte todos los campos (__all__) de la tabla cliente
class TiendaClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCliente
        fields = '__all__'

# 5. TRADUCTOR DE CATEGORÍAS: Envía el nombre y la foto de la categoría (Ej: Mariscos)
class TiendaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCategoria
        fields = ['id', 'nombre', 'descripcion', 'imagen']

# 6. TRADUCTOR DEL CARRITO: Maneja lo que el usuario quiere comprar
class TiendaCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCarrito
        fields = '__all__'

class TiendaItemcarritoSerializer(serializers.ModelSerializer):
    # Aquí hago un truco: 'producto_detalle' trae toda la info del pescado
    # para que en el carrito de React veamos la foto y el nombre, no solo el ID.
    producto_detalle = TiendaProductoSerializer(source='producto', read_only=True)
    class Meta:
        model = TiendaItemcarrito
        fields = ['id', 'carrito', 'producto', 'cantidad', 'producto_detalle']

# 7. TRADUCTOR DE PEDIDOS: Convierte las compras finalizadas para el historial del usuario
class TiendaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'

class TiendaHistorialestadopedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaHistorialestadopedido
        fields = '__all__'

# 8. TRADUCTOR DE SEGURIDAD (OTP): Convierte el código de 4 números que enviamos por correo
class UserOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOTP
        fields = ['otp_code', 'created_at']

# 9. TRADUCTOR DE PAGOS: Verifica si el pedido está pagado o pendiente
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = ['id', 'estado_actual']

class TiendaPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido
        fields = '__all__'
