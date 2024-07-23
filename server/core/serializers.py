"""
Serializers for the core app.

Classes:
    UserSerializer: Serializer for User model.
    WaitlistSerializer: Serializer for Waitlist model.
    WaitlistWithNamesSerializer: Serializer for Waitlist model with user names.
    VerificationSerializer: Serializer for Verification model.
    UserWithVerificationSerializer: Serializer for User model focusing on verification status.
    ReferralsWithDetailsSerializer: Serializer for Referral model with detailed referee information.
    ReferralSerializer: Serializer for Referral model.
"""

from rest_framework import serializers
from .models import User, Waitlist, Verification, Referral, AccessCode


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model.
    Includes fields: id, name, email, is_verified, referral_code, referral_count.
    """

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
    """
    Serializer for Waitlist model.
    Includes all fields in the model.
    """

    class Meta:
        model = Waitlist
        fields = "__all__"


class WaitlistWithNamesSerializer(serializers.ModelSerializer):
    """
    Serializer for Waitlist model with user names.
    Includes fields: user (name), position.
    """

    user = serializers.SlugRelatedField(slug_field="name", read_only=True)

    class Meta:
        model = Waitlist
        fields = ("user", "position")


class VerificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Verification model.
    Includes all fields in the model.
    """

    class Meta:
        model = Verification
        fields = "__all__"


class UserWithVerificationSerializer(serializers.ModelSerializer):
    """
    Serializer for User model focusing on verification status.
    Includes fields: name, is_verified.
    """

    class Meta:
        model = User
        fields = ("name", "is_verified")


class ReferralsWithDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for Referral model with detailed referee information.
    Includes nested UserWithVerificationSerializer for the referee field.
    """

    referee = UserWithVerificationSerializer(read_only=True)

    class Meta:
        model = Referral
        fields = ("referee",)


class ReferralSerializer(serializers.ModelSerializer):
    """
    Serializer for Referral model.
    Includes all fields in the model.
    """

    class Meta:
        model = Referral
        fields = "__all__"


class AccessCodeSerializer(serializers.ModelSerializer):
    """
    Serializer for AccessCode model.
    Includes all fields in the model.
    """

    class Meta:
        model = AccessCode
        fields = "__all__"
