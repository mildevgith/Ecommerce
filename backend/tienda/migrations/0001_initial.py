import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TiendaCategoria',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
            ],
            options={
                'db_table': 'tienda_categoria',
            },
        ),
        migrations.CreateModel(
            name='TiendaCupondescuento',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('codigo', models.CharField(max_length=20, unique=True)),
                ('descuento', models.DecimalField(decimal_places=2, max_digits=5)),
                ('valido_desde', models.DateField()),
                ('valido_hasta', models.DateField()),
                ('activo', models.BooleanField()),
            ],
            options={
                'db_table': 'tienda_cupondescuento',
            },
        ),
        migrations.CreateModel(
            name='TiendaMetodopago',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'tienda_metodopago',
            },
        ),
        migrations.CreateModel(
            name='TiendaCliente',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('direccion', models.CharField(max_length=255)),
                ('telefono', models.CharField(max_length=20)),
                ('ciudad', models.CharField(max_length=100)),
                ('departamento', models.CharField(max_length=100)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tienda_cliente',
            },
        ),
        migrations.CreateModel(
            name='TiendaCarrito',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('creado', models.DateTimeField()),
                ('cliente', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendacliente')),
            ],
            options={
                'db_table': 'tienda_carrito',
            },
        ),
        migrations.CreateModel(
            name='TiendaPedido',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('fecha_pedido', models.DateTimeField()),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('direccion_envio', models.CharField(max_length=255)),
                ('estado_actual', models.CharField(max_length=50)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendacliente')),
            ],
            options={
                'db_table': 'tienda_pedido',
            },
        ),
        migrations.CreateModel(
            name='TiendaPago',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('fecha_pago', models.DateTimeField()),
                ('referencia', models.CharField(max_length=100)),
                ('estado', models.CharField(max_length=50)),
                ('metodo', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendametodopago')),
                ('pedido', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendapedido')),
            ],
            options={
                'db_table': 'tienda_pago',
            },
        ),
        migrations.CreateModel(
            name='TiendaHistorialestadopedido',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('estado', models.CharField(max_length=50)),
                ('fecha_cambio', models.DateTimeField()),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendapedido')),
            ],
            options={
                'db_table': 'tienda_historialestadopedido',
            },
        ),
        migrations.CreateModel(
            name='TiendaProducto',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.TextField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('stock', models.IntegerField()),
                ('imagen', models.CharField(blank=True, max_length=100, null=True)),
                ('fecha_creacion', models.DateTimeField()),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendacategoria')),
            ],
            options={
                'db_table': 'tienda_producto',
            },
        ),
        migrations.CreateModel(
            name='TiendaItemcarrito',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField()),
                ('carrito', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendacarrito')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendaproducto')),
            ],
            options={
                'db_table': 'tienda_itemcarrito',
            },
        ),
        migrations.CreateModel(
            name='TiendaInventario',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('cantidad_actual', models.IntegerField()),
                ('actualizado', models.DateTimeField()),
                ('producto', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendaproducto')),
            ],
            options={
                'db_table': 'tienda_inventario',
            },
        ),
        migrations.CreateModel(
            name='TiendaDetalleproducto',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('detalles', models.TextField()),
                ('producto', models.OneToOneField(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendaproducto')),
            ],
            options={
                'db_table': 'tienda_detalleproducto',
            },
        ),
        migrations.CreateModel(
            name='TiendaDetallepedido',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField()),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendapedido')),
                ('producto', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendaproducto')),
            ],
            options={
                'db_table': 'tienda_detallepedido',
            },
        ),
        migrations.CreateModel(
            name='TiendaResenaproducto',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('puntuacion', models.IntegerField()),
                ('comentario', models.TextField()),
                ('fecha', models.DateTimeField()),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendacliente')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='tienda.tiendaproducto')),
            ],
            options={
                'db_table': 'tienda_resenaproducto',
            },
        ),
    ]
