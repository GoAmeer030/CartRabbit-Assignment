from datetime import timedelta
import os
from math import ceil

from django.utils.crypto import get_random_string
from django.utils import timezone
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.views import APIView
from rest_framework.response import Response

from .tasks import send_email, create_waitlist, create_referrals, update_waitlist
from .serializers import (
    UserSerializer,
    VerificationSerializer,
    WaitlistSerializer,
    WaitlistWithNamesSerializer,
)
from .models import Verification, User, Referral, Waitlist


class AuthenticationView(APIView):
    def send_verification_mail(self, code, mail):
        subject = "Verification Code"
        client_url = os.getenv("CLIENT_URL")
        message = f"Click this link to be verified {client_url}/verify/?code={code}"
        recipient_list = [mail]

        send_email.delay(subject, message, recipient_list)

    def post(self, request, code=None):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_instance = user_serializer.save()

            if code and User.objects.filter(referral_code=code).exists():
                create_referrals.delay(code, user_serializer.data["id"])
            elif code:
                user_instance.delete()
                return Response({"message": "Invalid referral code"}, status=400)

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
            return Response({"message": "Invalid verification code"}, status=400)

        if verification.user.is_verified:
            return Response({"message": "Verification Successfull!!"}, status=400)

        if verification.created_at < timezone.now() - timedelta(minutes=10):
            return Response({"message": "Verification code expired"}, status=400)

        verification.user.is_verified = True
        verification.user.save()

        create_waitlist.delay(verification.user.id)

        referrer = Referral.objects.filter(referee=verification.user).first()
        if referrer is not None:
            referrer_id = referrer.referrer.id
            update_waitlist.delay(referrer_id)

        return Response({"message": "User verified successfully"}, status=200)


class UserView(APIView):
    def get(self, request):
        email = request.query_params.get("email")
        if email:
            return self.get_user_by_mail(request, email)

    def get_user_by_mail(self, request, email):
        if email is None:
            return Response({"message": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({"message": "User not found"}, status=404)

        if user.is_deleted:
            return Response({"message": "User not found"}, status=404)

        return Response(UserSerializer(user).data, status=200)


class WaitlistView(APIView):
    def get(self, request):
        id = request.query_params.get("id")
        if id:
            return self.get_waitlist_by_id(request, id)

    def get_waitlist_by_id(self, request, id):
        if id is None:
            return Response({"message": "Id is required"}, status=400)

        waitlist = Waitlist.objects.filter(user=id).first()
        if waitlist is None:
            return Response({"message": "Waitlist not found"}, status=404)

        return Response(WaitlistSerializer(waitlist).data, status=200)


class WaitlistWithNamesPagination(PageNumberPagination):
    page_size = 2

    def paginate_queryset(self, queryset, request, view=None):
        return super(WaitlistWithNamesPagination, self).paginate_queryset(
            queryset, request, view
        )

    def get_paginated_response(self, data):
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "total_pages": ceil(self.page.paginator.count / self.page_size),
                "results": data,
            }
        )


class WaitlistWithNamesView(generics.ListAPIView):
    queryset = Waitlist.objects.all().order_by("position")
    serializer_class = WaitlistWithNamesSerializer
    pagination_class = WaitlistWithNamesPagination
