from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import random

class TiendaBanner(models.Model):
    titulo = models.CharField(max_length=100, blank=True, null=True)
    imagen = models.ImageField(upload_to='banners/')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    class Meta:
        db_table = 'tienda_banner'
        verbose_name = "Banner"
        verbose_name_plural = "Banners"

    def __str__(self):
        return self.titulo or f"Banner #{self.id}"


class TiendaCliente(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255, blank=True, null=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    pais = models.CharField(max_length=255, null=True, blank=True)
    codigoPostal = models.CharField(max_length=25, null=True, blank=True)
    ciudad = models.CharField(max_length=100, null=True, blank=True)
    departamento = models.CharField(max_length=100, null=True, blank=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tienda_cliente'

    def __str__(self):
        return self.user.username if self.user else f"Cliente {self.id}"



class TiendaCategoria(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    imagen = models.URLField(max_length=500, blank=True, null=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    activo = models.BooleanField(default=True)
    categoria_padre = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategorias')
    orden = models.IntegerField(default=0)
    meta_titulo = models.CharField(max_length=150, blank=True, null=True)
    meta_descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'tienda_categoria'
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['orden', 'nombre']

    def __str__(self):
        if self.categoria_padre:
            return f"{self.categoria_padre.nombre} > {self.nombre}"
        return self.nombre



class TiendaProducto(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=12, decimal_places=2) #
    precio_oferta = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField()
    imagen = models.URLField(max_length=500, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    categoria = models.ForeignKey('tienda.TiendaCategoria', on_delete=models.DO_NOTHING)
    es_destacado = models.BooleanField(default=False)
    en_oferta = models.BooleanField(default=False, verbose_name="¿Está en oferta?")
    fin_oferta = models.DateTimeField(null=True, blank=True, verbose_name="Vence el")

    class Meta:
        db_table = 'tienda_producto'

    def __str__(self):
        return self.nombre



class TiendaCarrito(models.Model):
    creado = models.DateTimeField(auto_now_add=True)
    cliente = models.OneToOneField('tienda.TiendaCliente', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_carrito'



class TiendaItemcarrito(models.Model):
    cantidad = models.IntegerField()
    carrito = models.ForeignKey('tienda.TiendaCarrito', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_itemcarrito'



class TiendaPedido(models.Model):
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    direccion_envio = models.CharField(max_length=255)
    estado_actual = models.CharField(max_length=50)
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING) #

    class Meta:
        db_table = 'tienda_pedido'

    def __str__(self):
        return f"Pedido #{self.id} de {self.cliente.user.username}"



class TiendaDetallepedido(models.Model):
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING) #
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'tienda_detallepedido'



class TiendaHistorialestadopedido(models.Model):
    estado = models.CharField(max_length=50)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING) #

    class Meta:
        db_table = 'tienda_historialestadopedido'



class TiendaMetodopago(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        db_table = 'tienda_metodopago'

    def __str__(self):
        return self.nombre


class TiendaPago(models.Model):
    fecha_pago = models.DateTimeField(auto_now_add=True)
    referencia = models.CharField(max_length=100)
    estado = models.CharField(max_length=50)
    metodo = models.ForeignKey('tienda.TiendaMetodopago', on_delete=models.DO_NOTHING, blank=True, null=True)
    pedido = models.OneToOneField('tienda.TiendaPedido', on_delete=models.DO_NOTHING)
    class Meta:
        db_table = 'tienda_pago'


class TiendaDetalleproducto(models.Model):
    detalles = models.TextField()
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_detalleproducto'



class TiendaInventario(models.Model):
    cantidad_actual = models.IntegerField()
    actualizado = models.DateTimeField(auto_now=True)
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_inventario'


class TiendaResenaproducto(models.Model):
    puntuacion = models.IntegerField()
    comentario = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING)
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING)

    class Meta:
        db_table = 'tienda_resenaproducto'



class TiendaCupondescuento(models.Model):
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
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    whatsapp = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número de WhatsApp")
    puntos = models.IntegerField(default=0, verbose_name="Puntos de Fidelidad")
    direccion = models.TextField(null=True, blank=True, verbose_name="Dirección de Envío")
    img = models.ImageField(upload_to='perfiles/', null=True, blank=True)

    def __str__(self):
        return f"Perfil de {self.user.email}"



class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=4, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_code(self):

        self.otp_code = str(random.randint(1000, 9999))
        self.save()

    def __str__(self):
        return f"Código OTP de {self.user.email}"



class TiendaSuscripcion(models.Model):
    email = models.EmailField(unique=True, max_length=254, verbose_name="Correo Electrónico")
    fecha_suscripcion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Subcripción")

    class Meta:
        db_table = 'tienda_suscripcion'
        verbose_name = "Suscripción"
        verbose_name_plural = "Suscripciones"

    def __str__(self):
        return self.email                                   
