from django.contrib import admin
from .models import (
    TiendaCliente, TiendaCategoria, TiendaProducto, TiendaCarrito,
    TiendaItemcarrito, TiendaPedido, TiendaDetallepedido,
    TiendaHistorialestadopedido, TiendaMetodopago, TiendaPago,
    TiendaDetalleproducto, TiendaInventario, TiendaResenaproducto,
    TiendaCupondescuento, UserOTP, Profile, TiendaBanner
)

@admin.register(TiendaBanner)
class TiendaBanner(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'activo', 'fecha_creacion')
    list_editable = ('activo',)

@admin.register(TiendaCliente)
class TiendaClienteAdmin(admin.ModelAdmin):
    list_display = ('user', 'ciudad', 'departamento', 'telefono', 'apellido')
    list_filter = ('ciudad', 'departamento', 'pais', 'apellido')
    search_fields = ('user__username', 'user__email', 'nombre', 'apellido', 'telefono')

@admin.register(TiendaCategoria)
class TiendaCategoriaAdmin(admin.ModelAdmin):

    list_display = ('nombre', 'slug', 'categoria_padre', 'activo', 'orden')
    list_filter = ('activo', 'categoria_padre')
    search_fields = ('nombre', 'descripcion')
    prepopulated_fields = {'slug': ('nombre',)}
    list_editable = ('activo', 'orden')

    fieldsets = (
        ('Información Principal', {
            'fields': ('nombre', 'slug', 'descripcion', 'imagen', 'categoria_padre')
        }),
        ('Configuración y Estado', {
            'fields': ('activo', 'orden')
        }),
        ('SEO (Posicionamiento en Google)', {
            'fields': ('meta_titulo', 'meta_descripcion'),
            'classes': ('collapse',),
        }),
    )


@admin.register(TiendaProducto)
class ProductoAdmin(admin.ModelAdmin):

    list_display = ('nombre', 'precio', 'stock', 'categoria', 'en_oferta')
    list_editable = ('precio', 'stock', 'en_oferta')
    list_filter = ('categoria', 'en_oferta', 'fecha_creacion')
    search_fields = ('nombre',)


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

    list_display = ('referencia', 'pedido', 'metodo', 'estado', 'fecha_pago') #
    list_filter = ('estado', 'metodo')



@admin.register(TiendaCupondescuento)
class TiendaCupondescuentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'descuento', 'valido_hasta', 'activo')
    list_editable = ('activo',)


admin.site.register(TiendaCarrito)
admin.site.register(TiendaItemcarrito)
admin.site.register(TiendaDetallepedido)
admin.site.register(TiendaHistorialestadopedido)
admin.site.register(TiendaMetodopago)
admin.site.register(TiendaDetalleproducto)
admin.site.register(TiendaResenaproducto)
admin.site.register(UserOTP)                     
admin.site.register(Profile)



