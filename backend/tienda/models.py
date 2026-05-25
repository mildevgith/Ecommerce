from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import random

# --- TABLA DE CLIENTES ---
class TiendaCliente(models.Model):
    # Conecto el cliente con un usuario del sistema (solo un cliente por usuario)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)
    departamento = models.CharField(max_length=100)

    class Meta:
        db_table = 'tienda_cliente' # Nombre real de la tabla en SQL

    def __str__(self):
        return self.user.username if self.user else f"Cliente {self.id}"


# --- CATEGORÍAS (Ej: Camarones, Pescados, Pulpos) ---
class TiendaCategoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True)

    class Meta:
        db_table = 'tienda_categoria'

    def __str__(self):
        return self.nombre


# --- PRODUCTOS ---
class TiendaProducto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    precio_oferta = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField() # Cantidad disponible
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    # Relaciono el producto con una categoría (Un producto pertenece a una categoría)
    categoria = models.ForeignKey('tienda.TiendaCategoria', on_delete=models.DO_NOTHING)
    es_destacado = models.BooleanField(default=False)
    en_oferta = models.BooleanField(default=False, verbose_name="¿Está en oferta?")
    fin_oferta = models.DateTimeField(null=True, blank=True, verbose_name="Vence el")

    class Meta:
        db_table = 'tienda_producto'

    def __str__(self):
        return self.nombre


# --- EL CARRITO DE COMPRAS ---
class TiendaCarrito(models.Model):
    creado = models.DateTimeField(auto_now_add=True)
    cliente = models.OneToOneField('tienda.TiendaCliente', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_carrito'


# --- LOS OBJETOS DENTRO DEL CARRITO ---
class TiendaItemcarrito(models.Model):
    cantidad = models.IntegerField()
    carrito = models.ForeignKey('tienda.TiendaCarrito', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_itemcarrito'


# --- EL PEDIDO FINALIZADO ---
class TiendaPedido(models.Model):
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    direccion_envio = models.CharField(max_length=255)
    estado_actual = models.CharField(max_length=50) # Ej: Pendiente, Enviado
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_pedido'

    def __str__(self):
        return f"Pedido #{self.id} de {self.cliente.user.username}"


# --- DETALLE DEL PEDIDO (Lo que compró exactamente) ---
class TiendaDetallepedido(models.Model):
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'tienda_detallepedido'


# --- HISTORIAL (Para saber cuándo cambió de "Enviado" a "Entregado") ---
class TiendaHistorialestadopedido(models.Model):
    estado = models.CharField(max_length=50)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_historialestadopedido'


# --- MÉTODOS DE PAGO (Ej: Nequi, Tarjeta, Efectivo) ---
class TiendaMetodopago(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tienda_metodopago'

    def __str__(self):
        return self.nombre


# --- EL PAGO REALIZADO ---
class TiendaPago(models.Model):
    fecha_pago = models.DateTimeField(auto_now_add=True)
    referencia = models.CharField(max_length=100) # Código del banco
    estado = models.CharField(max_length=50) # Ej: Aprobado
    metodo = models.ForeignKey('tienda.TiendaMetodopago', on_delete=models.DO_NOTHING, blank=True, null=True)
    pedido = models.OneToOneField('tienda.TiendaPedido', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_pago'


# --- DETALLES EXTRA (Para descripciones muy largas de productos) ---
class TiendaDetalleproducto(models.Model):
    detalles = models.TextField()
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_detalleproducto'


# --- CONTROL DE INVENTARIO ---
class TiendaInventario(models.Model):
    cantidad_actual = models.IntegerField()
    actualizado = models.DateTimeField(auto_now=True) # Se actualiza solo al cambiar datos
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_inventario'


# --- RESEÑAS Y ESTRELLITAS ---
class TiendaResenaproducto(models.Model):
    puntuacion = models.IntegerField() # Ej: del 1 al 5
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_resenaproducto'


# --- CUPONES DE DESCUENTO ---
class TiendaCupondescuento(models.Model):
    codigo = models.CharField(unique=True, max_length=20) # Ej: PESCADO2024
    descuento = models.DecimalField(max_digits=5, decimal_places=2)
    valido_desde = models.DateField()
    valido_hasta = models.DateField()
    activo = models.BooleanField()

    class Meta:
        db_table = 'tienda_cupondescuento'

    def __str__(self):
        return self.codigo


# --- PERFIL DE USUARIO (Extensión del usuario de Django) ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    whatsapp = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número de WhatsApp")
    puntos = models.IntegerField(default=0, verbose_name="Puntos de Fidelidad")
    direccion = models.TextField(null=True, blank=True, verbose_name="Dirección de Envío")
    img = models.ImageField(upload_to='perfiles/', null=True, blank=True)

    def __str__(self):
        return f"Perfil de {self.user.email}"


# --- SEGURIDAD (Códigos OTP para login) ---
class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=4, blank=True, null=True) # El código de 4 números
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):
        # Función para crear un número al azar entre 1000 y 9999
        self.otp_code = str(random.randint(1000, 9999))
        self.save()

    def __str__(self):
        return f"Código OTP de {self.user.email}"


# --- NUEVO: SISTEMA DE SUSCRIPCIONES (Boletín de Noticias) ---
class TiendaSuscripcion(models.Model):
    email = models.EmailField(unique=True, max_length=254, verbose_name="Correo Electrónico")
    fecha_suscripcion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Suscripción")

    class Meta:
        db_table = 'tienda_suscripcion'
        verbose_name = "Suscripción"
        verbose_name_plural = "Suscripciones"

    def __str__(self):
        return self.email