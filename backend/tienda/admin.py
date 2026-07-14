from django.contrib import admin
# Traigo todos los modelos (tablas) que creamos para la base de datos de la tienda
from .models import (
    TiendaCliente, TiendaCategoria, TiendaProducto, TiendaCarrito,
    TiendaItemcarrito, TiendaPedido, TiendaDetallepedido,
    TiendaHistorialestadopedido, TiendaMetodopago, TiendaPago,
    TiendaDetalleproducto, TiendaInventario, TiendaResenaproducto,
    TiendaCupondescuento, UserOTP, Profile
)

# --- GESTIÓN DE CLIENTES ---
@admin.register(TiendaCliente) # Registra el modelo TiendaCliente vinculándolo con su clase de configuración personalizada.
class TiendaClienteAdmin(admin.ModelAdmin):
    # Qué columnas quiero ver en la tabla de clientes
    list_display = ('user', 'ciudad', 'departamento', 'telefono') # Define los campos del modelo que se mostrarán como columnas en la lista del panel.
    # Filtros a la derecha para agrupar clientes por zona
    list_filter = ('ciudad', 'departamento')                       # Crea bloques laterales interactivos para filtrar los registros por ubicación geográfica.
    # Buscador por nombre de usuario o teléfono
    search_fields = ('user__username', 'telefono')                 # Habilita una barra superior de búsqueda que filtra por el nombre del usuario (relación) o su celular.

# --- GESTIÓN DE PRODUCTOS (El corazón de EXPOMARKET) ---
@admin.register(TiendaProducto) # Registra el modelo TiendaProducto vinculándolo con su clase de configuración personalizada.
class ProductoAdmin(admin.ModelAdmin):
    # Columnas principales: nombre, plata, existencias, tipo y si está barato
    list_display = ('nombre', 'precio', 'stock', 'categoria', 'en_oferta') # Especifica las columnas clave visibles para el inventario de mariscos.

    # ¡Poder total! Puedo cambiar precio y stock desde afuera sin abrir el producto
    list_editable = ('precio', 'stock', 'en_oferta')                       # Permite editar los precios, cantidades y ofertas directamente desde la tabla general de la lista.

    # Para encontrar rápido lo que está en promoción o lo más nuevo
    list_filter = ('categoria', 'en_oferta', 'fecha_creacion')             # Agrega filtros rápidos por tipo de producto, estado promocional y fecha de ingreso.

    # Si tengo mil productos, busco por nombre y listo
    search_fields = ('nombre',)                                            # Activa la barra de búsqueda por texto que machea con el nombre del producto marino.

# --- GESTIÓN DE PEDIDOS ---
@admin.register(TiendaPedido) # Registra el modelo TiendaPedido vinculándolo con su clase de configuración personalizada.
class TiendaPedidoAdmin(admin.ModelAdmin):
    # Veo quién compró, cuándo, cuánto pagó y en qué va el envío
    list_display = ('id', 'cliente', 'fecha_pedido', 'total', 'estado_actual') # Muestra el resumen logístico y comercial de cada orden de compra generada.
    list_filter = ('estado_actual', 'fecha_pedido')                            # Agrega filtros laterales para clasificar pedidos por su flujo (pendiente, enviado) y fecha.
    # Que los pedidos más nuevos me salgan siempre de primero
    ordering = ('-fecha_pedido',)                                              # Ordena los registros de manera descendente (el signo menos indica del más reciente al más antiguo).

# --- CONTROL DE BODEGA ---
@admin.register(TiendaInventario) # Registra el modelo TiendaInventario vinculándolo con su clase de configuración personalizada.
class TiendaInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'cantidad_actual', 'actualizado') # Muestra el nombre del ítem, su stock real en bodega y el último cambio registrado.
    search_fields = ('producto__nombre',)                         # Permite buscar en el inventario apuntando al nombre del modelo relacionado 'producto'.

# --- CONTROL DE PAGOS ---
@admin.register(TiendaPago) # Registra el modelo TiendaPago vinculándolo con su clase de configuración personalizada.
class TiendaPagoAdmin(admin.ModelAdmin):
    # Para rastrear la plata: referencia del banco, método y si ya entró el dinero
    list_display = ('referencia', 'pedido', 'metodo', 'estado', 'fecha_pago') # Columnas contables críticas para auditoría de transacciones monetarias.
    list_filter = ('estado', 'metodo')                                         # Filtros rápidos para ver cuáles pagos fueron aprobados, rechazados o por qué pasarela ingresaron.

# --- CUPONES DE DESCUENTO ---
@admin.register(TiendaCupondescuento) # Registra el modelo TiendaCupondescuento vinculándolo con su clase de configuración personalizada.
class TiendaCupondescuentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'descuento', 'valido_hasta', 'activo') # Muestra el identificador del cupón, el porcentaje/monto a restar, vigencia y estado.
    # Activo o desactivo cupones con un solo clic desde la lista
    list_editable = ('activo',)                                      # Permite prender o apagar la vigencia de los cupones directamente desde la tabla general.

# Registro básico para lo que no necesita tanta personalización por ahora
admin.site.register(TiendaCategoria)             # Registra la tabla de categorías para que aparezca en el panel con su comportamiento estándar.
admin.site.register(TiendaCarrito)               # Registra los carritos activos creados por los usuarios de la plataforma.
admin.site.register(TiendaItemcarrito)           # Registra la lista de los productos desglosados dentro de cada carrito de compras.
admin.site.register(TiendaDetallepedido)         # Registra la vista del desglose unitario de artículos facturados en una compra.
admin.site.register(TiendaHistorialestadopedido) # Registra la bitácora de seguimiento temporal sobre los estados de envío de las órdenes.
admin.site.register(TiendaMetodopago)            # Registra los tipos de pago aceptados por la tienda (Efectivo, Transferencia, Tarjeta).
admin.site.register(TiendaDetalleproducto)       # Registra las descripciones o especificaciones técnicas adicionales de los ítems.
admin.site.register(TiendaResenaproducto)        # Registra las valoraciones y comentarios de texto enviados por los clientes sobre los pescados/mariscos.
admin.site.register(UserOTP)                     # Registra la base de datos de claves temporales de un solo uso (One-Time Password) enviadas para seguridad.
admin.site.register(Profile)                     # Registra la extensión de datos de usuario para el manejo del perfil general dentro del sitio.