from django.contrib import admin
from .models import (
    TiendaCliente, TiendaCategoria, TiendaProducto, TiendaCarrito,
    TiendaItemcarrito, TiendaPedido, TiendaDetallepedido,
    TiendaHistorialestadopedido, TiendaMetodopago, TiendaPago,
    TiendaDetalleproducto, TiendaInventario, TiendaResenaproducto,
    TiendaCupondescuento, UserOTP, Profile
)



@admin.register(TiendaCliente)
class TiendaClienteAdmin(admin.ModelAdmin):
    list_display = ('user', 'ciudad', 'departamento', 'telefono')
    list_filter = ('ciudad', 'departamento')
    search_fields = ('user__username', 'telefono')

@admin.register(TiendaProducto)
class TiendaProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'precio', 'stock', 'categoria', 'fecha_creacion')
    list_filter = ('categoria', 'fecha_creacion')
    search_fields = ('nombre',)
    list_editable = ('precio', 'stock')

@admin.register(TiendaPedido)
class TiendaPedidoAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha_pedido', 'total', 'estado_actual')
    list_filter = ('estado_actual', 'fecha_pedido')
    ordering = ('-fecha_pedido',)

@admin.register(TiendaInventario)
class TiendaInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'cantidad_actual', 'actualizado')
    search_fields = ('producto__nombre',)

@admin.register(TiendaPago)
class TiendaPagoAdmin(admin.ModelAdmin):
    list_display = ('referencia', 'pedido', 'metodo', 'estado', 'fecha_pago')
    list_filter = ('estado', 'metodo')

@admin.register(TiendaCupondescuento)
class TiendaCupondescuentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'descuento', 'valido_hasta', 'activo')
    list_editable = ('activo',)


admin.site.register(TiendaCategoria)
admin.site.register(TiendaCarrito)
admin.site.register(TiendaItemcarrito)
admin.site.register(TiendaDetallepedido)
admin.site.register(TiendaHistorialestadopedido)
admin.site.register(TiendaMetodopago)
admin.site.register(TiendaDetalleproducto)
admin.site.register(TiendaResenaproducto)
admin.site.register(UserOTP)
admin.site.register(Profile)

