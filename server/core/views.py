from datetime import timedelta

from django.utils.crypto import get_random_string
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response

from .tasks import send_email, create_waitlist
from .serializers import UserSerializer, VerificationSerializer
from .models import Verification


class AuthenticationView(APIView):
    def send_verification_mail(self, code, mail):
        subject = "Verification Code"
        message = f"Click this link to be verified http://localhost:8000/api/auth/verify/{code}/"
        recipient_list = [mail]

        send_email.delay(subject, message, recipient_list)

    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()

            random_code = get_random_string(length=6)

            while Verification.objects.filter(unique_code=random_code).exists():
                random_code = get_random_string(length=6)

            verfication_serializer = VerificationSerializer(
                data={"unique_code": random_code, "user": user_serializer.data["id"]}
            )
            if verfication_serializer.is_valid():
                verfication_serializer.save()

                self.send_verification_mail(
                    verfication_serializer.data["unique_code"],
                    user_serializer.data["email"],
                )

                return Response(user_serializer.data, status=201)

            return Response(verfication_serializer.errors, status=400)

        return Response(user_serializer.errors, status=400)


class VerificationView(APIView):
    def get(self, request, code):
        verification = Verification.objects.filter(unique_code=code).first()

        if verification is None:
            return Response({"error": "Invalid verification code"}, status=400)

        if verification.user.is_verified:
            return Response({"error": "User already verified"}, status=400)

        if verification.created_at < timezone.now() - timedelta(minutes=10):
            return Response({"error": "Verification code expired"}, status=400)

        verification.user.is_verified = True
        verification.user.save()
        
        create_waitlist.delay(verification.user.id)

        return Response({"message": "User verified successfully"}, status=200)
