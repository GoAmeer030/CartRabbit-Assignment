"""
Views for the core app.

Classes:
    AuthenticationView: API view for user authentication and verification email sending.
    VerificationView: API view for user verification.
    UserView: API view for retrieving user details.
    WaitlistView: API view for retrieving waitlist details.
    WaitlistWithNamesPagination: Custom pagination class for waitlist with names.
    WaitlistWithNamesView: API view for retrieving the waitlist with user names.
    ReferralsWithDetailsPagination: Custom pagination class for referrals with details.
    ReferralsWithDetailsView: API view for retrieving referrals with details.
"""

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
    ReferralsWithDetailsSerializer,
)
from .models import Verification, User, Referral, Waitlist


class AuthenticationView(APIView):
    """API view for user authentication and verification email sending."""

    def send_verification_mail(self, code, mail):
        """
        Send a verification email with a unique code.

        Args:
            code (str): The unique verification code.
            mail (str): The recipient's email address.
        """
        subject = "Verification Code"
        client_url = os.getenv("CLIENT_URL")
        message = f"Click this link to be verified {client_url}/verify/?code={code}"
        recipient_list = [mail]

        send_email.delay(subject, message, recipient_list)

    def post(self, request, code=None):
        """
        Handle user registration and send verification email.

        Args:
            request (HttpRequest): The request object containing user data.
            code (str, optional): The referral code. Defaults to None.

        Returns:
            Response: The response object with user data or error message.
        """
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

            verification_serializer = VerificationSerializer(
                data={"unique_code": random_code, "user": user_serializer.data["id"]}
            )
            if verification_serializer.is_valid():
                verification_serializer.save()

                self.send_verification_mail(
                    verification_serializer.data["unique_code"],
                    user_serializer.data["email"],
                )

                return Response(user_serializer.data, status=201)

            return Response(verification_serializer.errors, status=400)

        return Response(user_serializer.errors, status=400)


class VerificationView(APIView):
    """API view for user verification."""

    def get(self, request, code):
        """
        Verify user using the provided verification code.

        Args:
            request (HttpRequest): The request object.
            code (str): The verification code.

        Returns:
            Response: The response object with success or error message.
        """
        verification = Verification.objects.filter(unique_code=code).first()

        if verification is None:
            return Response({"message": "Invalid verification code"}, status=400)

        if verification.user.is_verified:
            return Response({"message": "Verification Successful!!"}, status=200)

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
    """API view for retrieving user details."""

    def get(self, request):
        """
        Retrieve user details by email.

        Args:
            request (HttpRequest): The request object.

        Returns:
            Response: The response object with user data or error message.
        """
        email = request.query_params.get("email")
        if email:
            return self.get_user_by_email(request, email)

    def get_user_by_email(self, request, email):
        """
        Retrieve user details by email.

        Args:
            request (HttpRequest): The request object.
            email (str): The user's email address.

        Returns:
            Response: The response object with user data or error message.
        """
        if email is None:
            return Response({"message": "Email is required"}, status=400)

        user = User.objects.filter(email=email).first()
        if user is None:
            return Response({"message": "User not found"}, status=404)

        if user.is_deleted:
            return Response({"message": "User not found"}, status=404)

        return Response(UserSerializer(user).data, status=200)


class WaitlistView(APIView):
    """API view for retrieving waitlist details."""

    def get(self, request):
        """
        Retrieve waitlist details by user ID.

        Args:
            request (HttpRequest): The request object.

        Returns:
            Response: The response object with waitlist data or error message.
        """
        user_id = request.query_params.get("id")
        if user_id:
            return self.get_waitlist_by_id(request, user_id)

    def get_waitlist_by_id(self, request, user_id):
        """
        Retrieve waitlist details by user ID.

        Args:
            request (HttpRequest): The request object.
            user_id (str): The user's ID.

        Returns:
            Response: The response object with waitlist data or error message.
        """
        if user_id is None:
            return Response({"message": "ID is required"}, status=400)

        waitlist = Waitlist.objects.filter(user=user_id).first()
        if waitlist is None:
            return Response({"message": "Waitlist not found"}, status=404)

        return Response(WaitlistSerializer(waitlist).data, status=200)


class WaitlistWithNamesPagination(PageNumberPagination):
    """Custom pagination class for waitlist with names."""

    page_size = 10

    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginate the queryset.

        Args:
            queryset (QuerySet): The queryset to paginate.
            request (HttpRequest): The request object.
            view (View, optional): The view object. Defaults to None.

        Returns:
            QuerySet: The paginated queryset.
        """
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        """
        Get the paginated response.

        Args:
            data (list): The paginated data.

        Returns:
            Response: The response object with pagination details.
        """
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
    """API view for retrieving the waitlist with user names."""

    queryset = Waitlist.objects.all().order_by("position")
    serializer_class = WaitlistWithNamesSerializer
    pagination_class = WaitlistWithNamesPagination


class ReferralsWithDetailsPagination(PageNumberPagination):
    """Custom pagination class for referrals with details."""

    page_size = 5

    def paginate_queryset(self, queryset, request, view=None):
        """
        Paginate the queryset.

        Args:
            queryset (QuerySet): The queryset to paginate.
            request (HttpRequest): The request object.
            view (View, optional): The view object. Defaults to None.

        Returns:
            QuerySet: The paginated queryset.
        """
        return super().paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        """
        Get the paginated response.

        Args:
            data (list): The paginated data.

        Returns:
            Response: The response object with pagination details.
        """
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


class ReferralsWithDetailsView(generics.ListAPIView):
    """API view for retrieving referrals with details."""

    serializer_class = ReferralsWithDetailsSerializer
    pagination_class = ReferralsWithDetailsPagination

    def get_queryset(self):
        """
        Get the queryset of referrals for a specific user.

        Returns:
            QuerySet: The queryset of referrals.
        """
        user_id = self.kwargs.get("id")
        return Referral.objects.filter(referrer=user_id)
