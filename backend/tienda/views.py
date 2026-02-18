import os
from dotenv import load_dotenv
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.contrib.auth.models import User
from django.core.mail import send_mail
from twilio.rest import Client

from .models import (
    TiendaProducto, TiendaCliente, TiendaCategoria, TiendaCarrito,
    TiendaItemcarrito, TiendaPedido, TiendaPago, UserOTP, Profile
)
from .serializers import (
    TiendaProductoSerializer, TiendaClienteSerializer, TiendaCategoriaSerializer,
    TiendaCarritoSerializer, TiendaItemcarritoSerializer, TiendaPedidoSerializer,
    DetalleProductoSerializer, TiendaPagoSerializer
)

# Cargar variables de entorno al inicio
load_dotenv()

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        whatsapp = request.data.get('whatsapp')
        if not email or not whatsapp:
            return Response({"error": "Email y WhatsApp son obligatorios"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=email, email=email)
        profile = user.profile
        profile.whatsapp = whatsapp
        profile.save()
        return Response({"message": "Usuario creado correctamente"}, status=status.HTTP_201_CREATED)

class RequestOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        channel = request.data.get('channel')

        try:
            user = User.objects.get(email=email)
            otp_obj, _ = UserOTP.objects.get_or_create(user=user)
            otp_obj.generate_code()

            mensaje = f"Tu código de verificación para Expomar es: {otp_obj.otp_code}"

            if channel == 'Email':
                send_mail(
                    'Código de Verificación - Expomar',
                    mensaje,
                    None,
                    [email],
                    fail_silently=False,
                )

            elif channel == 'WhatsApp':
                # --- INTEGRACIÓN SEGURA DE TWILIO ---
                account_sid = os.getenv('TWILIO_ACCOUNT_SID')
                auth_token = os.getenv('TWILIO_AUTH_TOKEN')

                if not account_sid or not auth_token:
                    return Response({"error": "Configuración de Twilio faltante"}, status=500)

                client = Client(account_sid, auth_token)
                numero_destino = f"whatsapp:{user.profile.whatsapp}"

                client.messages.create(
                    body=mensaje,
                    from_='whatsapp:+14155238886',
                    to=numero_destino
                )

            return Response({"message": f"Código enviado por {channel}"})

        except User.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)
        except Exception as e:
            return Response({"error": f"Error al enviar: {str(e)}"}, status=500)

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            otp_obj = UserOTP.objects.get(user__email=email, otp_code=code)
            return Response({"message": "Login exitoso", "user": {"email": email}})
        except UserOTP.DoesNotExist:
            return Response({"error": "Código incorrecto"}, status=status.HTTP_400_BAD_REQUEST)

# --- VIEWSETS ---
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = TiendaProducto.objects.all().order_by('id')
    serializer_class = TiendaProductoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class TiendaClienteViewSet(viewsets.ModelViewSet):
    queryset = TiendaCliente.objects.all().order_by('id')
    serializer_class = TiendaClienteSerializer

class TiendaCategoriaViewSet(viewsets.ModelViewSet):
    queryset = TiendaCategoria.objects.all().order_by('id')
    serializer_class = TiendaCategoriaSerializer

class TiendaCarritoViewSet(viewsets.ModelViewSet):
    queryset = TiendaCarrito.objects.all().order_by('id')
    serializer_class = TiendaCarritoSerializer

class TiendaPedidoViewSet(viewsets.ModelViewSet):
    queryset = TiendaPedido.objects.all().order_by('id')
    serializer_class = TiendaPedidoSerializer

class PagoViewSet(viewsets.ModelViewSet):
    queryset = TiendaPago.objects.all().order_by('id')
    serializer_class = TiendaPagoSerializer
