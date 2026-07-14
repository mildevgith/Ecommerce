from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
import random

# --- TABLA DE CLIENTES ---
class TiendaCliente(models.Model):
    # Conecto el cliente con un usuario del sistema (solo un cliente por usuario)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING) # Crea una relación uno a uno con el modelo de usuarios general sin borrar el cliente si el usuario se elimina.
    direccion = models.CharField(max_length=255)            # Campo de texto para guardar la ubicación física o domicilio del cliente.
    telefono = models.CharField(max_length=20)              # Campo de texto optimizado para almacenar el número telefónico o celular de contacto.
    ciudad = models.CharField(max_length=100)               # Campo para registrar el municipio o ciudad de residencia del comprador.
    departamento = models.CharField(max_length=100)         # Campo para registrar el estado, provincia o departamento de envío.

    class Meta:
        db_table = 'tienda_cliente' # Nombre real de la tabla en SQL # Fuerza a la base de datos a usar este nombre exacto para la tabla física en PostgreSQL/MySQL.

    def __str__(self):
        return self.user.username if self.user else f"Cliente {self.id}" # Define la representación en texto del objeto, mostrando el nombre de usuario o su ID de respaldo.


# --- CATEGORÍAS (Ej: Camarones, Pescados, Pulpos) ---
class TiendaCategoria(models.Model):
    nombre = models.CharField(max_length=100)               # Campo para dar un título o nombre único a la categoría de mariscos.
    descripcion = models.TextField()                        # Campo de texto largo para detallar las especificaciones generales de la categoría.
    imagen = models.ImageField(upload_to='categorias/', blank=True, null=True) # Define la ruta de subida en el almacenamiento para la foto representativa de la categoría.

    class Meta:
        db_table = 'tienda_categoria'                       # Establece el nombre técnico de la tabla de categorías dentro de la base de datos SQL.

    def __str__(self):
        return self.nombre                                  # Muestra el nombre directo de la categoría al listarla en cualquier parte del sistema.


# --- PRODUCTOS ---
class TiendaProducto(models.Model):
    nombre = models.CharField(max_length=200)               # Campo de texto para el título comercial del pescado o marisco.
    descripcion = models.TextField()                        # Campo de bloque largo para detallar las características u origen del producto.
    precio = models.DecimalField(max_digits=12, decimal_places=2) # Campo numérico exacto de alta precisión para el costo base del artículo.
    precio_oferta = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True) # Campo decimal opcional para guardar el costo rebajado de promoción.
    stock = models.IntegerField() # Cantidad disponible      # Campo numérico entero para el control y conteo de existencias físicas en bodega.
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True) # Define la ruta de la carpeta donde se almacenarán las fotos de los productos.
    fecha_creacion = models.DateTimeField(auto_now_add=True) # Registra de forma automática la fecha y hora exacta en la que se sube el producto.
    # Relaciono el producto con una categoría (Un producto pertenece a una categoría)
    categoria = models.ForeignKey('tienda.TiendaCategoria', on_delete=models.DO_NOTHING) # Vincula el producto a una categoría padre (Relación de uno a muchos).
    es_destacado = models.BooleanField(default=False)       # Interruptor booleano (Sí/No) para resaltar el producto en el banner o inicio del frontend.
    en_oferta = models.BooleanField(default=False, verbose_name="¿Está en oferta?") # Interruptor booleano para activar visualmente las etiquetas de descuento.
    fin_oferta = models.DateTimeField(null=True, blank=True, verbose_name="Vence el") # Almacena la fecha y hora límite de expiración para los precios promocionales.

    class Meta:
        db_table = 'tienda_producto'                        # Configura el identificador físico de la tabla de catálogo de productos en SQL.

    def __str__(self):
        return self.nombre                                  # Devuelve el título del producto marino para identificarlo con facilidad.


# --- EL CARRITO DE COMPRAS ---
class TiendaCarrito(models.Model):
    creado = models.DateTimeField(auto_now_add=True)         # Captura automáticamente la marca de tiempo de cuándo el cliente inició la selección.
    cliente = models.OneToOneField('tienda.TiendaCliente', on_delete=models.DO_NOTHING) # Asocia de forma exclusiva un único carrito activo por cada cliente registrado.

    class Meta:
        db_table = 'tienda_carrito'                         # Asigna el nombre técnico a la tabla relacional de carritos en la base de datos.


# --- LOS OBJETOS DENTRO DEL CARRITO ---
class TiendaItemcarrito(models.Model):
    cantidad = models.IntegerField()                        # Guarda el número de unidades de un mismo producto que el usuario desea comprar.
    carrito = models.ForeignKey('tienda.TiendaCarrito', on_delete=models.DO_NOTHING) # Conecta el ítem con el carrito contenedor correspondiente (Relación uno a muchos).
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING) # Vincula el ítem con la información específica del producto seleccionado.

    class Meta:
        db_table = 'tienda_itemcarrito'                     # Define el nombre de la tabla que desglosa los artículos intermedios del carrito en SQL.


# --- EL PEDIDO FINALIZADO ---
class TiendaPedido(models.Model):
    fecha_pedido = models.DateTimeField(auto_now_add=True)   # Captura el momento exacto en el que el usuario confirma y procesa su orden de compra.
    total = models.DecimalField(max_digits=10, decimal_places=2) # Almacena de manera exacta el monto total facturado de la venta global.
    direccion_envio = models.CharField(max_length=255)      # Duplica o registra la dirección específica de entrega destinada para esta orden.
    estado_actual = models.CharField(max_length=50) # Ej: Pendiente, Enviado # Cadena de texto para controlar en qué fase logística se encuentra la orden.
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING) # Conecta de manera directa el pedido con el historial del cliente comprador.

    class Meta:
        db_table = 'tienda_pedido'                          # Establece el nombre formal de la tabla de órdenes de compra en la base de datos.

    def __str__(self):
        return f"Pedido #{self.id} de {self.cliente.user.username}" # Retorna una cadena formateada con el número de pedido y usuario para rastreo en el admin.


# --- DETALLE DEL PEDIDO (Lo que compró exactamente) ---
class TiendaDetallepedido(models.Model):
    cantidad = models.IntegerField()                        # Registra cuántas unidades concretas se facturaron de ese artículo en el pedido.
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2) # Congela el precio del producto al momento de la compra para auditorías.
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING) # Enlaza esta línea de detalle con su orden de pedido maestra.
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING, blank=True, null=True) # Vincula el artículo comprado (admite nulos si el producto se descataloga).

    class Meta:
        db_table = 'tienda_detallepedido'                   # Nombra la tabla de desglose finalizado de productos facturados en SQL.


# --- HISTORIAL (Para saber cuándo cambió de "Enviado" a "Entregado") ---
class TiendaHistorialestadopedido(models.Model):
    estado = models.CharField(max_length=50)                # Guarda el nombre del estado por el que pasó el pedido en esa etapa específica.
    fecha_cambio = models.DateTimeField(auto_now_add=True)   # Registra la fecha y hora automatizada de cuándo ocurrió la actualización logística.
    pedido = models.ForeignKey('tienda.TiendaPedido', on_delete=models.DO_NOTHING) # Relaciona la bitácora de seguimiento con su pedido máster.

    class Meta:
        db_table = 'tienda_historialestadopedido'            # Define el nombre técnico de la tabla de auditoría de estados de envío.


# --- MÉTODOS DE PAGO (Ej: Nequi, Tarjeta, Efectivo) ---
class TiendaMetodopago(models.Model):
    nombre = models.CharField(max_length=100)               # Guarda el nombre público de la modalidad de pago aceptada en el checkout.

    class Meta:
        db_table = 'tienda_metodopago'                      # Establece el nombre formal de la tabla catálogo de opciones de pago.

    def __str__(self):
        return self.nombre                                  # Muestra el nombre de la pasarela o método en las opciones del sistema.


# --- EL PAGO REALIZADO ---
class TiendaPago(models.Model):
    fecha_pago = models.DateTimeField(auto_now_add=True)     # Registra la estampa de tiempo exacta en que se procesó la transacción económica.
    referencia = models.CharField(max_length=100) # Código del banco # Guarda el ID único, token o comprobante proveído por la entidad financiera.
    estado = models.CharField(max_length=50) # Ej: Aprobado # Controla si el dinero fue verificado, rechazado o se encuentra en validación.
    metodo = models.ForeignKey('tienda.TiendaMetodopago', on_delete=models.DO_NOTHING, blank=True, null=True) # Conecta la transacción con el tipo de método usado.
    pedido = models.OneToOneField('tienda.TiendaPedido', on_delete=models.DO_NOTHING) # Vincula de forma exclusiva un único registro de pago con su respectivo pedido.

    class Meta:
        db_table = 'tienda_pago'                            # Define el identificador físico de la tabla contable de pagos en SQL.


# --- DETALLES EXTRA (Para descripciones muy largas de productos) ---
class TiendaDetalleproducto(models.Model):
    detalles = models.TextField()                           # Bloque de texto ilimitado para fichas técnicas, recetas o modos de conservación del marisco.
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING) # Extiende la información de un producto con una relación exclusiva 1 a 1.

    class Meta:
        db_table = 'tienda_detalleproducto'                 # Asigna el nombre a la tabla de almacenamiento de textos enriquecidos o extendidos.


# --- CONTROL DE INVENTARIO ---
class TiendaInventario(models.Model):
    cantidad_actual = models.IntegerField()                  # Mapea las existencias numéricas en tiempo real que quedan en las bodegas de almacenamiento.
    actualizado = models.DateTimeField(auto_now=True) # Se actualiza solo al cambiar datos # Modifica automáticamente su estampa de tiempo cada vez que se altere el stock.
    producto = models.OneToOneField('tienda.TiendaProducto', on_delete=models.DO_NOTHING) # Vincula directamente el control de stock de forma única con su producto.

    class Meta:
        db_table = 'tienda_inventario'                      # Nombra la tabla técnica encargada de las auditorías de stock en bodega.


# --- RESEÑAS Y ESTRELLITAS ---
class TiendaResenaproducto(models.Model):
    puntuacion = models.IntegerField() # Ej: del 1 al 5      # Guarda el valor numérico entero que representa la calificación de satisfacción del cliente.
    comentario = models.TextField()                         # Texto de opinión enviado por el cliente detallando su experiencia de consumo.
    fecha = models.DateTimeField(auto_now_add=True)          # Captura automáticamente el momento en que se redactó e ingresó la opinión.
    cliente = models.ForeignKey('tienda.TiendaCliente', on_delete=models.DO_NOTHING) # Identifica qué cliente específico redactó la valoración del artículo.
    producto = models.ForeignKey('tienda.TiendaProducto', on_delete=models.DO_NOTHING) # Conecta de forma directa la reseña con el producto calificado.

    class Meta:
        db_table = 'tienda_resenaproducto'                  # Establece el nombre de la tabla de comentarios y valoraciones del ecommerce.


# --- CUPONES DE DESCUENTO ---
class TiendaCupondescuento(models.Model):
    codigo = models.CharField(unique=True, max_length=20) # Ej: PESCADO2024 # Texto único en mayúsculas que el cliente digita para aplicar una rebaja.
    descuento = models.DecimalField(max_digits=5, decimal_places=2) # Define el valor porcentual o numérico exacto a restar del subtotal.
    valido_desde = models.DateField()                       # Fecha inicial de calendario en que el cupón entra en vigencia de uso.
    valido_hasta = models.DateField()                       # Fecha límite de calendario que restringe y vence la validez del cupón.
    activo = models.BooleanField()                          # Interruptor manual para deshabilitar o habilitar el cupón instantáneamente.

    class Meta:
        db_table = 'tienda_cupondescuento'                  # Nombra la tabla encargada de almacenar las reglas de cupones de mercadeo.

    def __str__(self):
        return self.codigo                                  # Muestra el texto del código promocional en los listados del sistema.


# --- PERFIL DE USUARIO (Extensión del usuario de Django) ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile') # Conecta de forma exclusiva el perfil extendido con el modelo Auth User destruyéndose si este se borra.
    whatsapp = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número de WhatsApp") # Almacena de manera opcional el número telefónico para integraciones de chat.
    puntos = models.IntegerField(default=0, verbose_name="Puntos de Fidelidad") # Lleva un conteo acumulativo entero de puntos redimibles para premiar las compras del cliente.
    direccion = models.TextField(null=True, blank=True, verbose_name="Dirección de Envío") # Bloque de texto libre para guardar la localización alternativa de despachos de la cuenta.
    img = models.ImageField(upload_to='perfiles/', null=True, blank=True) # Guarda la ruta física de la imagen o avatar personalizado de la cuenta del usuario.

    def __str__(self):
        return f"Perfil de {self.user.email}"               # Muestra una cadena que identifica el perfil según el correo del usuario correspondiente.


# --- SEGURIDAD (Códigos OTP para login) ---
class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Asocia un único espacio de almacenamiento de llaves temporales de seguridad por cada usuario.
    otp_code = models.CharField(max_length=4, blank=True, null=True) # El código de 4 números # Cadena de texto de longitud corta encargada de verificar la clave numérica secreta.
    created_at = models.DateTimeField(auto_now_add=True)     # Captura el instante preciso de generación del código para controlar su tiempo de expiración.

    def generate_code(self):
        # Función para crear un número al azar entre 1000 y 9999
        self.otp_code = str(random.randint(1000, 9999))     # Ejecuta el algoritmo aleatorio matemático y lo convierte a string para asignarlo.
        self.save()                                         # Persiste e impacta el nuevo código OTP generado directamente en la base de datos.

    def __str__(self):
        return f"Código OTP de {self.user.email}"           # Retorna un texto de auditoría que asocia el token de seguridad al correo del dueño.


# --- NUEVO: SISTEMA DE SUSCRIPCIONES (Boletín de Noticias) ---
class TiendaSuscripcion(models.Model):
    email = models.EmailField(unique=True, max_length=254, verbose_name="Correo Electrónico") # Almacena cadenas validadas con formato de email de manera única para evitar suscripciones duplicadas.
    fecha_suscripcion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Subcripción") # Captura de forma automática el momento en que la cuenta se une al boletín.

    class Meta:
        db_table = 'tienda_suscripcion'                     # Establece el nombre técnico de la tabla de base de datos para el módulo de newsletter.
        verbose_name = "Suscripción"                        # Traduce el nombre legible del modelo en singular dentro del administrador.
        verbose_name_plural = "Suscripciones"                # Traduce el nombre estructurado del modelo en plural para el árbol del administrador.

    def __str__(self):
        return self.email                                   # Devuelve el correo del suscriptor para listarlo de forma directa en el panel de campañas.