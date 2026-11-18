import os
import secrets
import unicodedata
from django.conf import settings
import random
from django.db import transaction
from django.core.mail import send_mail
from datetime import timedelta
from django.db.models import Q
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.pagination import PageNumberPagination
from .serializers import RecetaSerializer
from django.utils import timezone
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model
from rest_framework import status
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .models import (
    TiendaProducto, TiendaCategoria, TiendaCarrito, TiendaCliente,
    TiendaPedido, TiendaDetallepedido, TiendaPago, TiendaMetodopago, Profile, TiendaBanner, TiendaCupondescuento, TiendaSuscripcion, Receta
)
from .serializers import (
    TiendaProductoSerializer, TiendaCategoriaSerializer,
    TiendaPedidoSerializer, ProfileSerializer, TiendaBannerSerializer
)


User = get_user_model()

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("credential")
        if not credential:
            return Response({"error": "Token de Google requerido"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({"error": "Token de Google inválido o expirado"}, status=status.HTTP_401_UNAUTHORIZED)

        email = idinfo.get("email")
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email,
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True,
            }
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "is_new_user": created
        }, status=status.HTTP_200_OK)


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all().order_by('-id')
    serializer_class = RecetaSerializer


def get_queryset(self):
        queryset = self.queryset

        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)

        search = self.request.query_params.get('search', None)
        if search:
            self.pagination_class = None
            termino = eliminar_tildes(search.strip()).lower()
            ids_coincidentes = [
                p.id for p in queryset
                if termino in eliminar_tildes(p.nombre).lower()
            ]
            queryset = queryset.filter(id__in=ids_coincidentes)

        return queryset.distinct()


class CatalogoPagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100

@method_decorator(csrf_exempt, name='dispatch')
class AuthRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = str(data.get('email', '')).lower().strip()
        password = str(data.get('password', '')).strip()
        nombre = str(data.get('nombre', '')).strip()
        whatsapp = str(data.get('whatsapp', '')).strip()

        # 1. Validaciones de entrada
        if not email or not password:
            return Response({"error": "El correo y la contraseña son obligatorios."}, status=400)

        try:
            validate_email(email)
        except ValidationError:
            return Response({"error": "El formato del correo electrónico no es válido."}, status=400)

        if len(password) < 8:
            return Response({"error": "La contraseña debe tener al menos 8 caracteres."}, status=400)

        # 2. Verificar duplicados sin importar mayúsculas/minúsculas
        if User.objects.filter(Q(username__iexact=email) | Q(email__iexact=email)).exists():
            return Response({"error": "Este correo ya se encuentra registrado."}, status=400)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                    first_name=nombre
                )

                profile, _ = Profile.objects.get_or_create(user=user)
                if whatsapp:
                    profile.whatsapp = whatsapp
                    profile.save()

                return Response({
                    "message": "Usuario creado correctamente",
                    "user": {
                        "email": user.email,
                        "first_name": user.first_name
                    }
                }, status=201)

        except Exception:
            # Evitar exponer trazas internas de la base de datos al cliente
            return Response({"error": "No se pudo completar el registro. Intenta nuevamente."}, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class AuthVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).lower().strip()
        password = str(request.data.get('password', '')).strip()

        if not email or not password:
            return Response({"error": "Ingresa tu correo y contraseña."}, status=400)

        # Buscar usuario por email o username ignorando mayúsculas
        user = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).first()

        # Validación segura en tiempo constante (evita enumeración de usuarios)
        if user is not None:
            password_valida = user.check_password(password)
        else:
            # Ejecuta un hash dummy para igualar el tiempo de respuesta si el usuario no existe
            check_password(password, "pbkdf2_sha256$600000$dummy$dummyhashvalue=")
            password_valida = False

        if user and password_valida and user.is_active:
            return Response({
                "message": "Login exitoso",
                "user": {
                    "email": user.email,
                    "first_name": user.first_name
                }
            }, status=200)

        return Response({"error": "Correo o contraseña incorrectos."}, status=401)
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user:
            return Response({
                "message": "Login exitoso",
                "user": { "email": user.email, "first_name": user.first_name }
            }, status=200)
        return Response({"error": "Credenciales inválidas"}, status=401)

@method_decorator(csrf_exempt, name='dispatch')
class SolicitarRecuperacionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).lower().strip()
        if not email:
            return Response({"error": "Ingresa tu correo electrónico."}, status=400)

        user = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).first()

        # Por seguridad, respondemos siempre 200 OK aunque el correo no exista (evita enumeración)
        if user and user.is_active:
            codigo = f"{secrets.randbelow(900000) + 100000}"  # Código criptográficamente seguro de 6 dígitos
            profile, _ = Profile.objects.get_or_create(user=user)
            profile.otp_code = codigo
            profile.otp_created_at = timezone.now()
            profile.save()

            asunto = "Código de recuperación de contraseña - Expomar"
            mensaje = (
                f"Hola {user.first_name or 'cliente'},\n\n"
                f"Tu código de verificación para restablecer tu contraseña en Expomar es:\n\n"
                f"    {codigo}\n\n"
                f"Este código es válido por 15 minutos. Si no solicitaste este cambio, ignora este mensaje."
            )

            try:
                send_mail(
                    asunto,
                    mensaje,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response({"error": "No se pudo enviar el correo. Intenta más tarde."}, status=500)

        return Response({
            "message": "Si el correo está registrado, recibirás un código de 6 dígitos en unos segundos."
        }, status=200)

@method_decorator(csrf_exempt, name='dispatch')
class ConfirmarRecuperacionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get('email', '')).lower().strip()
        codigo = str(request.data.get('codigo', '')).strip()
        nueva_password = str(request.data.get('nueva_password', '')).strip()

        if not email or not codigo or not nueva_password:
            return Response({"error": "Todos los campos son obligatorios."}, status=400)

        if len(nueva_password) < 8:
            return Response({"error": "La nueva contraseña debe tener al menos 8 caracteres."}, status=400)

        user = User.objects.filter(Q(email__iexact=email) | Q(username__iexact=email)).first()
        if not user or not hasattr(user, 'profile'):
            return Response({"error": "Código inválido o expirado."}, status=400)

        profile = user.profile

        # Verificar existencia y expiración (15 minutos)
        if not profile.otp_code or not profile.otp_created_at:
            return Response({"error": "No hay una solicitud activa. Pide un nuevo código."}, status=400)

        if timezone.now() > profile.otp_created_at + timedelta(minutes=15):
            profile.otp_code = None
            profile.otp_created_at = None
            profile.save()
            return Response({"error": "El código ha expirado. Solicita uno nuevo."}, status=400)

        # Comparación segura contra ataques de tiempo
        if not secrets.compare_digest(profile.otp_code, codigo):
            return Response({"error": "El código ingresado es incorrecto."}, status=400)

        # Actualizar contraseña e invalidar el código inmediatamente
        user.set_password(nueva_password)
        user.save()

        profile.otp_code = None
        profile.otp_created_at = None
        profile.save()

        return Response({"message": "Contraseña actualizada correctamente. Ya puedes iniciar sesión."}, status=200)


class BannerViewSet(viewsets.ModelViewSet):
    queryset = TiendaBanner.objects.all()
    serializer_class = TiendaBannerSerializer
    permission_classes = [AllowAny]

class LegacyBannerViewSet(viewsets.ModelViewSet):
    queryset = TiendaBanner.objects.all()
    serializer_class = TiendaBannerSerializer
    permission_classes = [AllowAny]


def eliminar_tildes(cadena):
    if not cadena:
        return ""
    return ''.join((c for c in unicodedata.normalize('NFD', cadena) if unicodedata.category(c) != 'Mn'))


class ProductCatalogViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('-id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [AllowAny]
    pagination_class = CatalogoPagination

    def get_queryset(self):
        queryset = self.queryset

        categoria_id = self.request.query_params.get('categoria', None)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)

        search = self.request.query_params.get('search', None)
        if search:
            self.pagination_class = None
            termino_limpio = eliminar_tildes(search.strip()).lower()

            if termino_limpio in ['oferta', 'ofertas', 'promocion', 'promociones']:
                queryset = queryset.filter(en_oferta=True)
            else:
                palabras = termino_limpio.split()
                ids_coincidentes = []
                for p in queryset:
                    cat_nombre = p.categoria.nombre if p.categoria else ""
                    desc = p.descripcion or ""
                    texto_completo = eliminar_tildes(f"{p.nombre} {desc} {cat_nombre}").lower()
                    if all(palabra in texto_completo for palabra in palabras):
                        ids_coincidentes.append(p.id)
                queryset = queryset.filter(id__in=ids_coincidentes)

        return queryset.distinct()

    @action(detail=False, methods=['get'], url_path='recomendados', permission_classes=[AllowAny])
    def recomendados(self, request):
        try:
            productos = TiendaProducto.objects.filter(es_destacado=True)[:4]
            if not productos.exists():
                productos = TiendaProducto.objects.all().order_by('-id')[:4]
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='ofertas', permission_classes=[AllowAny])
    def ofertas(self, request):
        try:
            self.pagination_class = None
            productos = TiendaProducto.objects.filter(en_oferta=True).order_by('-id')
            serializer = self.get_serializer(productos, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='recomendados', permission_classes=[AllowAny])
    def recomendados(self, request):
        try:
            productos = TiendaProducto.objects.filter(es_destacado=True)[:4]
            if not productos.exists():
                productos = TiendaProducto.objects.all().order_by('-id')[:4]
            serializer = self.get_serializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['get'], url_path='ofertas', permission_classes=[AllowAny])
    def ofertas(self, request):
        try:
            self.pagination_class = None
            productos = TiendaProducto.objects.filter(en_oferta=True).order_by('-id')
            serializer = self.get_serializer(productos, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CrearPedidoView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        try:
            with transaction.atomic():
                email_cliente = data['datos_envio']['email'].lower().strip()
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first()

                if not user:
                    return Response({"error": "Usuario no encontrado. Inicie sesión."}, status=404)

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={
                        'direccion': data['datos_envio']['direccion'],
                        'ciudad': data['datos_envio']['ciudad']
                    }
                )
                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                )

                for item in data['items']:
                    producto = TiendaProducto.objects.get(id=item['producto_id'])
                    TiendaDetallepedido.objects.create(
                        pedido=pedido,
                        producto=producto,
                        cantidad=item['cantidad'],
                        precio_unitario=item['precio_unitario']
                    )

                serializer = TiendaPedidoSerializer(pedido)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except KeyError as e:
            return Response({"error": f"Falta el campo: {str(e)}"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all()
    serializer_class = TiendaCategoriaSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    @action(detail=True, methods=['get'], url_path='productos', permission_classes=[AllowAny])
    def productos(self, request, slug=None):
        try:
            self.pagination_class = None
            categoria = self.get_object()
            productos = TiendaProducto.objects.filter(categoria=categoria).order_by('-id')
            serializer = TiendaProductoSerializer(productos, many=True, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TiendaCategoria.DoesNotExist:
            return Response({"error": "La categoría especificada no existe"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all()
    serializer_class = TiendaPedidoSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            with transaction.atomic():
                email_cliente = data['datos_envio']['email'].lower().strip()
                user = User.objects.filter(Q(email=email_cliente) | Q(username=email_cliente)).first()

                if not user:
                    return Response({"error": "Usuario no encontrado."}, status=404)

                cliente, _ = TiendaCliente.objects.get_or_create(
                    user=user,
                    defaults={'direccion': data['datos_envio']['direccion'], 'ciudad': data['datos_envio']['ciudad']}
                )

                pedido = TiendaPedido.objects.create(
                    cliente=cliente,
                    total=data['total'],
                    direccion_envio=f"{data['datos_envio']['direccion']}, {data['datos_envio']['ciudad']}",
                    estado_actual="Pendiente"
                )

                for item in data['items']:
                    producto = TiendaProducto.objects.get(id=item['producto_id'])
                    TiendaDetallepedido.objects.create(
                        pedido=pedido, producto=producto,
                        cantidad=item['cantidad'], precio_unitario=item['precio_unitario']
                    )

                serializer = self.get_serializer(pedido)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=400)


class ValidarCuponView(APIView):
    def post(self, request):
        codigo = request.data.get('codigo', '').strip().upper()
        total_carrito = float(request.data.get('total', 0))

        if not codigo:
            return Response({"error": "Ingresa un código de cupón válido."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cupon = TiendaCupondescuento.objects.get(codigo=codigo, activo=True)

            if hasattr(cupon, 'fecha_expiracion') and cupon.fecha_expiracion:
                if cupon.fecha_expiracion < timezone.now().date():
                    return Response({"error": "Este cupón ha expirado."}, status=status.HTTP_400_BAD_REQUEST)

            monto_descuento = 0
            if hasattr(cupon, 'porcentaje_descuento') and cupon.porcentaje_descuento:
                monto_descuento = (total_carrito * float(cupon.porcentaje_descuento)) / 100
            elif hasattr(cupon, 'monto_fijo') and cupon.monto_fijo:
                monto_descuento = float(cupon.monto_fijo)

            return Response({
                "valido": True,
                "codigo": cupon.codigo,
                "descuento": monto_descuento,
                "mensaje": f"¡Cupón '{cupon.codigo}' aplicado con éxito!"
            }, status=status.HTTP_200_OK)

        except TiendaCupondescuento.DoesNotExist:
            return Response({"error": "El cupón ingresado no existe o no está activo."}, status=status.HTTP_404_NOT_FOUND)


class RegistrarSuscripcionView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()

        if not email:
            return Response({"error": "Por favor, ingresa un correo válido."}, status=status.HTTP_400_BAD_REQUEST)

        if TiendaSuscripcion.objects.filter(email=email).exists():
            return Response({"message": "Este correo ya se encuentra registrado."}, status=status.HTTP_200_OK)

        try:
            TiendaSuscripcion.objects.create(email=email)
            return Response({"success": "¡Te has suscrito correctamente!"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": "Hubo un problema al procesar tu solicitud."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
