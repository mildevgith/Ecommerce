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
@admin.register(TiendaCliente)
class TiendaClienteAdmin(admin.ModelAdmin):
    # Qué columnas quiero ver en la tabla de clientes
    list_display = ('user', 'ciudad', 'departamento', 'telefono')
    # Filtros a la derecha para agrupar clientes por zona
    list_filter = ('ciudad', 'departamento')
    # Buscador por nombre de usuario o teléfono
    search_fields = ('user__username', 'telefono')

# --- GESTIÓN DE PRODUCTOS (El corazón de EXPOMARKET) ---
@admin.register(TiendaProducto)
class ProductoAdmin(admin.ModelAdmin):
    # Columnas principales: nombre, plata, existencias, tipo y si está barato
    list_display = ('nombre', 'precio', 'stock', 'categoria', 'en_oferta')

    # ¡Poder total! Puedo cambiar precio y stock desde afuera sin abrir el producto
    list_editable = ('precio', 'stock', 'en_oferta')

    # Para encontrar rápido lo que está en promoción o lo más nuevo
    list_filter = ('categoria', 'en_oferta', 'fecha_creacion')

    # Si tengo mil productos, busco por nombre y listo
    search_fields = ('nombre',)

# --- GESTIÓN DE PEDIDOS ---
@admin.register(TiendaPedido)
class TiendaPedidoAdmin(admin.ModelAdmin):
    # Veo quién compró, cuándo, cuánto pagó y en qué va el envío
    list_display = ('id', 'cliente', 'fecha_pedido', 'total', 'estado_actual')
    list_filter = ('estado_actual', 'fecha_pedido')
    # Que los pedidos más nuevos me salgan siempre de primero
    ordering = ('-fecha_pedido',)

# --- CONTROL DE BODEGA ---
@admin.register(TiendaInventario)
class TiendaInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'cantidad_actual', 'actualizado')
    search_fields = ('producto__nombre',)

# --- CONTROL DE PAGOS ---
@admin.register(TiendaPago)
class TiendaPagoAdmin(admin.ModelAdmin):
    # Para rastrear la plata: referencia del banco, método y si ya entró el dinero
    list_display = ('referencia', 'pedido', 'metodo', 'estado', 'fecha_pago')
    list_filter = ('estado', 'metodo')

# --- CUPONES DE DESCUENTO ---
@admin.register(TiendaCupondescuento)
class TiendaCupondescuentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'descuento', 'valido_hasta', 'activo')
    # Activo o desactivo cupones con un solo clic desde la lista
    list_editable = ('activo',)

# Registro básico para lo que no necesita tanta personalización por ahora
admin.site.register(TiendaCategoria)
admin.site.register(TiendaCarrito)
admin.site.register(TiendaItemcarrito)
admin.site.register(TiendaDetallepedido)
admin.site.register(TiendaHistorialestadopedido)
admin.site.register(TiendaMetodopago)
admin.site.register(TiendaDetalleproducto)
admin.site.register(TiendaResenaproducto)
admin.site.register(UserOTP) # Para los códigos de seguridad del correo
admin.site.register(Profile) # Para los datos extra de los perfiles
