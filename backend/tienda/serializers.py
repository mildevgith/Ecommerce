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
        model = User                                                    # Vincula este serializador de forma directa con el modelo nativo de usuarios de Django.
        fields = ['id', 'email', 'username']                            # Especifica exactamente qué datos de la cuenta se empaquetarán en el formato JSON final.

# 2. TRADUCTOR DE PERFIL: Muy importante para que el Navbar muestre el nombre del usuario logueado
class ProfileSerializer(serializers.ModelSerializer):
    # Meto el UserSerializer adentro para que cuando React pida el perfil,
    # también le llegue el email y el username del usuario.
    user = UserSerializer(read_only=True)                               # Anida el serializador de usuarios en modo lectura para estructurar los datos del dueño dentro de la respuesta del perfil.
    class Meta:
        model = Profile                                                 # Vincula el serializador con el modelo Profile que extiende los datos del usuario.
        fields = ['id', 'user', 'whatsapp', 'puntos', 'direccion', 'img'] # Estructura los campos del perfil y el objeto anidado para consumirlos directamente en el frontend.

# 3. TRADUCTOR DE PRODUCTOS: Pasa toda la info del pescado a React (precios, ofertas, etc.)
class TiendaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaProducto                                          # Conecta este serializador con el catálogo físico de pescados y mariscos.
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'stock',
            'imagen', 'fecha_creacion', 'categoria', 'en_oferta',
            'precio_oferta', 'es_destacado', 'fin_oferta'
        ]                                                               # Lista de forma exhaustiva todos los atributos comerciales y de stock para renderizar las tarjetas en React.

# 4. TRADUCTOR DE CLIENTES: Convierte todos los campos (__all__) de la tabla cliente
class TiendaClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCliente                                           # Conecta el serializador con el registro de datos geográficos y telefónicos del cliente.
        fields = '__all__'                                              # Mapea de forma automática absolutamente todas las columnas existentes de la tabla a formato JSON.

# 5. TRADUCTOR DE CATEGORÍAS: Envía el nombre y la foto de la categoría (Ej: Mariscos)
class TiendaCategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCategoria                                         # Vincula este serializador con la tabla encargada de agrupar las familias de productos.
        fields = ['id', 'nombre', 'descripcion', 'imagen']              # Serializa el identificador, título, texto explicativo y la ruta de la foto de la categoría.

# 6. TRADUCTOR DEL CARRITO: Maneja lo que el usuario quiere comprar
class TiendaCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaCarrito                                           # Vincula la configuración con la cabecera o registro maestro del carrito del comprador.
        fields = '__all__'                                              # Extrae de forma automática el ID, la fecha de creación y la relación del cliente dueño.

class TiendaItemcarritoSerializer(serializers.ModelSerializer):
    # Aquí hago un truco: 'producto_detalle' trae toda la info del pescado
    # para que en el carrito de React veamos la foto y el nombre, no solo el ID.
    producto_detalle = TiendaProductoSerializer(source='producto', read_only=True) # Usa el serializador de productos para desglosar la info completa del artículo apuntando a la relación origen.
    class Meta:
        model = TiendaItemcarrito                                       # Vincula la estructura con el modelo de líneas de artículos intermedios del carrito.
        fields = ['id', 'carrito', 'producto', 'cantidad', 'producto_detalle'] # Define los campos de control numérico e incluye el desglose detallado del producto para el frontend.

# 7. TRADUCTOR DE PEDIDOS: Convierte las compras finalizadas para el historial del usuario
class TiendaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido                                            # Conecta la estructura con el registro histórico de órdenes de compra finalizadas.
        fields = '__all__'                                              # Mapea todos los totales, direcciones y estados de la orden para que React construya la vista de recibos.

class TiendaHistorialestadopedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaHistorialestadopedido                             # Vincula el proceso con la bitácora de auditoría temporal de flujos de envío.
        fields = '__all__'                                              # Devuelve de forma serializada los registros de cambio de estado logístico del pedido.

# 8. TRADUCTOR DE SEGURIDAD (OTP): Convierte el código de 4 números que enviamos por correo
class UserOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOTP                                                 # Conecta con la tabla que gestiona los tokens numéricos temporales de seguridad.
        fields = ['otp_code', 'created_at']                             # Serializa de forma estricta únicamente la clave de cuatro dígitos y su marca de tiempo de creación.

# 9. TRADUCTOR DE PAGOS: Verifica si el pedido está pagado o pendiente
class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido                                            # Reutiliza el modelo de órdenes de compra para mapear flujos rápidos de verificación.
        fields = ['id', 'estado_actual']                                # Devuelve de forma limitada únicamente el identificador y el estado de flujo de la orden.

class TiendaPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiendaPedido                                            # Vincula la transacción final con los datos globales de la orden de compra.
        fields = '__all__'                                              # Mapea todas las propiedades relacionales del pedido para auditoría de transacciones monetarias.