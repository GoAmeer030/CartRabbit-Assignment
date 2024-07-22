"""
This file is for registering the models with the Django admin interface.

Classes:
    UserAdmin: Admin interface options for User model.
    WaitlistAdmin: Admin interface options for Waitlist model.
    ReferralAdmin: Admin interface options for Referral model.
    VerificationAdmin: Admin interface options for Verification model.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import User as DjangoUser, Group as DjangoGroup

from unfold.admin import ModelAdmin

from .models import User, Waitlist, Referral, Verification


admin.site.unregister(DjangoUser)
admin.site.unregister(DjangoGroup)


@admin.register(DjangoUser)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    pass


@admin.register(DjangoGroup)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


@admin.register(User)
class UserAdmin(ModelAdmin):
    """
    Administration interface options for User model.

    - Displays user ID, name, email, referral code, referral count, verification status, and deletion status.
    - Allows searching by name and email.
    - Filters available for verification and deletion status.
    """

    list_display = (
        "id",
        "name",
        "email",
        "referral_code",
        "referral_count",
        "is_verified",
        "is_deleted",
    )
    search_fields = ("name", "email")
    list_filter = ("is_verified", "is_deleted")


@admin.register(Waitlist)
class WaitlistAdmin(ModelAdmin):
    """
    Administration interface options for Waitlist model.

    - Displays user and their position in the waitlist.
    - Allows searching by user name.
    - Filters available for position.
    - Orders entries by position.
    """

    list_display = ("user", "position")
    search_fields = ("user__name",)
    list_filter = ("position",)
    order_by = ("position",)


@admin.register(Referral)
class ReferralAdmin(ModelAdmin):
    """
    Administration interface options for Referral model.

    - Displays referrer, referee, and the creation date of the referral.
    - Allows searching by referrer and referee names.
    - Filters available for creation date.
    """

    list_display = ("referrer", "referee", "created_at")
    search_fields = ("referrer__name", "referee__name")
    list_filter = ("created_at",)


@admin.register(Verification)
class VerificationAdmin(ModelAdmin):
    """
    Administration interface options for Verification model.

    - Displays unique verification code and associated user.
    - Allows searching by user name.
    - Filters available for unique verification code.
    """

    list_display = ("unique_code", "user")
    search_fields = ("user__name",)
    list_filter = ("unique_code",)
