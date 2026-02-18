from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import random


class TiendaCliente(models.Model):
    # Relación uno a uno con el usuario de autenticación del sistema
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    # Datos de contacto y ubicación física para logística de envíos
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)

    class Meta:
        db_table = 'tienda_cliente' # Mapeo directo a la tabla existente en PostgreSQL

    def __str__(self):
        return self.user.username if self.user else f"Cliente {self.id}"


class TiendaCategoria(models.Model):
    # Clasificación lógica de productos
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    class Meta:
        db_table = 'tienda_categoria'

    def __str__(self):
        return self.nombre


class TiendaProducto(models.Model):
    # Atributos principales del catálogo de productos
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2) # Precisión para valores monetarios
    stock = models.IntegerField()
    imagen = models.CharField(max_length=100, blank=True, null=True) # Almacena la ruta del archivo
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    # Relación de muchos a uno: Un producto pertenece a una categoría
    categoria = models.ForeignKey('tienda.TiendaCategoria', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_producto'

    def __str__(self):
        return self.nombre


class TiendaCarrito(models.Model):
    # Persistencia del carrito de compras temporal por cliente
    creado = models.DateTimeField(auto_now_add=True)
    cliente = models.OneToOneField('tienda.TiendaCliente', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_carrito'


class TiendaItemcarrito(models.Model):
    # Detalle de productos específicos dentro de un carrito
    cantidad = models.IntegerField()
    carrito = models.ForeignKey('tienda.TiendaCarrito', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_itemcarrito'


class TiendaPedido(models.Model):
    # Registro formal de una transacción finalizada
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    direccion_envio = models.CharField(max_length=255)
    estado_actual = models.CharField(max_length=50)
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_pedido'

    def __str__(self):
        return f"Pedido #{self.id} de {self.cliente.user.username}"


class TiendaDetallepedido(models.Model):
    # Histórico de precios y cantidades al momento de la compra
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'tienda_detallepedido'


class TiendaHistorialestadopedido(models.Model):
    # Trazabilidad para el seguimiento del envío
    estado = models.CharField(max_length=50)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_historialestadopedido'


class TiendaMetodopago(models.Model):
    # Opciones de pago: Tarjeta, Efectivo, Transferencia
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tienda_metodopago'

    def __str__(self):
        return self.nombre


class TiendaPago(models.Model):
    # Confirmación y referencia de la transacción financiera
    fecha_pago = models.DateTimeField(auto_now_add=True)
    referencia = models.CharField(max_length=100)
    estado = models.CharField(max_length=50)
    metodo = models.ForeignKey('tienda.TiendaMetodopago', on_delete=models.DO_NOTHING, blank=True, null=True)
    pedido = models.OneToOneField('tienda.TiendaPedido', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_pago'


class TiendaDetalleproducto(models.Model):
    # Especificaciones técnicas adicionales del producto
    detalles = models.TextField()
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_detalleproducto'


class TiendaInventario(models.Model):
    # Control de existencias en tiempo real
    cantidad_actual = models.IntegerField()
    actualizado = models.DateTimeField(auto_now=True)
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_inventario'


class TiendaResenaproducto(models.Model):
    # Sistema de feedback y calificación de clientes
    puntuacion = models.IntegerField()
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_resenaproducto'


class TiendaCupondescuento(models.Model):
    # Gestión de promociones y marketing
    codigo = models.CharField(unique=True, max_length=20)
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    valido_desde = models.DateField()
    valido_hasta = models.DateField()
    activo = models.BooleanField()

    class Meta:
        db_table = 'tienda_cupondescuento'

    def __str__(self):
        return self.codigo



class Profile(models.Model):
    # Relacionamos este perfil con un Usuario único.
    # on_delete=models.CASCADE significa que si borras al usuario, se borra su perfil.
    # related_name='profile' nos permite acceder desde el usuario (user.profile.whatsapp)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Campo para el WhatsApp. Usamos CharField porque los números pueden empezar con +
    # null=True y blank=True permiten que al principio el campo esté vacío
    whatsapp = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número de WhatsApp")

    # Aquí puedes añadir más campos que necesites para Expomar
    puntos = models.IntegerField(default=0, verbose_name="Puntos de Fidelidad")
    direccion = models.TextField(null=True, blank=True, verbose_name="Dirección de Envío")

    # Esta función define cómo se verá el objeto en el panel de administrador de Django
    def __str__(self):
        return f"Perfil de {self.user.email}"

# --- MODELO OTP (Para los códigos temporales) ---

class UserOTP(models.Model):
    # También vinculado al usuario
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    # Guardamos el código de 4 dígitos como texto para evitar problemas con ceros a la izquierda
    otp_code = models.CharField(max_length=4, blank=True, null=True)

    # Se guarda la fecha y hora exacta en que se creó el código
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):
        self.otp_code = str(random.randint(1000, 9999)) # Genera 4 dígitos
        self.save()

    def __str__(self):
        return f"Código OTP de {self.user.email}"
