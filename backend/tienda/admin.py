from django.contrib import admin
from .models import (
    TiendaCliente, TiendaCategoria, TiendaProducto, TiendaCarrito,
    TiendaItemcarrito, TiendaPedido, TiendaDetallepedido,
    TiendaHistorialestadopedido, TiendaMetodopago, TiendaPago,
    TiendaDetalleproducto, TiendaInventario, TiendaResenaproducto,
    TiendaCupondescuento, UserOTP, Profile, TiendaBanner, Receta, TiendaSuscripcion
)


@admin.register(TiendaCupondescuento)
class TiendaCupondescuentoAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'porcentaje_descuento', 'activo', 'fecha_expiracion')
    search_fields = ('codigo',)
    list_filter = ('activo', 'fecha_expiracion')


@admin.register(TiendaSuscripcion)
class TiendaSuscripcionAdmin(admin.ModelAdmin):
    list_display = ('email', 'fecha_suscripcion')
    search_fields = ('email',)
    list_filter = ('fecha_suscripcion',)


@admin.register(TiendaCliente) 
class TiendaClienteAdmin(admin.ModelAdmin):
    list_display = ('user', 'ciudad', 'departamento', 'telefono', 'nombre', 'apellido')
    list_filter = ('ciudad', 'departamento')
    search_fields = ('user__username', 'telefono', 'nombre', 'apellido')


@admin.register(TiendaCategoria)
class TiendaCategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'categoria_padre', 'activo', 'orden')
    list_filter = ('activo', 'categoria_padre')
    search_fields = ('nombre', 'descripcion')
    
    list_editable = ('activo', 'orden')
    fieldsets = (
        ('Información Principal', {
            'fields': ('nombre', 'descripcion', 'imagen', 'categoria_padre')
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


class TiendaDetallepedidoInline(admin.TabularInline):
    model = TiendaDetallepedido
    extra = 0
    readonly_fields = ['nombre_producto', 'cantidad', 'precio_unitario', 'subtotal_item']


@admin.register(TiendaPedido) 
class TiendaPedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'cliente', 'email_contacto', 'creado_en', 'total', 'estado_pago', 'estado_actual'] 
    list_filter = ['estado_pago', 'estado_actual', 'creado_en']                           
    search_fields = ['email_contacto', 'transaccion_id']
    ordering = ['-creado_en']                                      
    inlines = [TiendaDetallepedidoInline]


@admin.register(TiendaInventario) 
class TiendaInventarioAdmin(admin.ModelAdmin):
    list_display = ('producto', 'cantidad_actual', 'actualizado') 
    search_fields = ('producto__nombre',)                                


@admin.register(TiendaPago) 
class TiendaPagoAdmin(admin.ModelAdmin):
    list_display = ('referencia', 'pedido', 'metodo', 'estado', 'fecha_pago') 
    list_filter = ('estado', 'metodo')                                    


@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'tiempo', 'porciones')
    search_fields = ('titulo', 'categoria')


@admin.register(TiendaBanner)
class TiendaBannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'activo', 'fecha_creacion')
    list_editable = ('activo',)


# Modelos auxiliares registrados de forma estándar
admin.site.register(TiendaCarrito)
admin.site.register(TiendaItemcarrito)
admin.site.register(TiendaDetallepedido)
admin.site.register(TiendaHistorialestadopedido)
admin.site.register(TiendaMetodopago)
admin.site.register(TiendaDetalleproducto)
admin.site.register(TiendaResenaproducto)
admin.site.register(UserOTP)
admin.site.register(Profile)