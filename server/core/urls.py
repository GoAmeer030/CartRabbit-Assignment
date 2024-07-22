"""
This module defines URL patterns for the application.

It includes routes for authentication, verification, user management, waitlist management, and referral details.

Routes:
- auth/: Handles authentication requests.
- auth/<str:code>/: Handles authentication with a referral code.
- auth/verify/<str:code>/: Handles verification of authentication codes.
- user/: Manages user information.
- waitlist/: Manages the waitlist for users without specifying names.
- global-waitlist/: Manages a global waitlist including names.
- referrals/<int:id>/: Provides details on referrals based on their ID.
"""

from django.urls import path

from .views import (
    AuthenticationView,
    VerificationView,
    ResendVerificationEmailView,
    UserView,
    WaitlistView,
    WaitlistWithNamesView,
    ReferralsWithDetailsView,
)

urlpatterns = [
    path("auth/", AuthenticationView.as_view(), name="auth"),
    path("auth/<str:code>/", AuthenticationView.as_view(), name="auth_with_referal"),
    path("auth/verify/<str:code>/", VerificationView.as_view(), name="verify"),
    path(
        "resend-verification-email/",
        ResendVerificationEmailView.as_view(),
        name="resend_verification_email",
    ),
    path("user/", UserView.as_view(), name="user"),
    path("waitlist/", WaitlistView.as_view(), name="waitlist"),
    path("global-waitlist/", WaitlistWithNamesView.as_view(), name="global_waitlist"),
    path("referrals/<int:id>/", ReferralsWithDetailsView.as_view(), name="referrals"),
]
