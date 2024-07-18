from django.urls import path

from .views import AuthenticationView, VerificationView

urlpatterns = [
    path("auth/", AuthenticationView.as_view(), name="auth"),
    path("auth/<str:code>/", AuthenticationView.as_view(), name="auth_with_referal"),
    path("auth/verify/<str:code>/", VerificationView.as_view(), name="verify"),
]
