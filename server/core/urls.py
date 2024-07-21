from django.urls import path

from .views import (
    AuthenticationView,
    VerificationView,
    UserView,
    WaitlistView,
    WaitlistWithNamesView,
    ReferralsWithDetailsView,
)

urlpatterns = [
    path("auth/", AuthenticationView.as_view(), name="auth"),
    path("auth/<str:code>/", AuthenticationView.as_view(), name="auth_with_referal"),
    path("auth/verify/<str:code>/", VerificationView.as_view(), name="verify"),
    path("user/", UserView.as_view(), name="user"),
    path("waitlist/", WaitlistView.as_view(), name="waitlist"),
    path("global-waitlist/", WaitlistWithNamesView.as_view(), name="global_waitlist"),
    path("referrals/<int:id>/", ReferralsWithDetailsView.as_view(), name="referrals"),
]
