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


class WaitlistWithNamesSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = Waitlist
        fields = ("user", "position")


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = "__all__"


class UserWithVerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("name", "is_verified")


class ReferralsWithDetailsSerializer(serializers.ModelSerializer):
    referee = UserWithVerificationSerializer(read_only=True)

    class Meta:
        model = Referral
        fields = ("referee",)


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = "__all__"
