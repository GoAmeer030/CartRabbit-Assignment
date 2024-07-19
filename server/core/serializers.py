from rest_framework import serializers
from .models import User, Waitlist, Verification, Referral


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "is_verified",
            "referral_code",
            "referral_count",
        )


class WaitlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Waitlist
        fields = "__all__"


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = "__all__"


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = "__all__"
