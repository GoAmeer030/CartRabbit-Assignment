"""
This file is for registering the models with the Django admin interface.

Classes:
    UserAdmin: Admin interface options for User model.
    WaitlistAdmin: Admin interface options for Waitlist model.
    ReferralAdmin: Admin interface options for Referral model.
    VerificationAdmin: Admin interface options for Verification model.
    AccessCodeAdmin: Admin interface options for AccessCode model.

Functions:
    send_mail: Sends mail to selected users.
"""

from django.contrib import admin
from django.utils.crypto import get_random_string
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.contrib.auth.models import User as DjangoUser, Group as DjangoGroup

from unfold.admin import ModelAdmin

from .serializers import AccessCodeSerializer
from .models import User, Waitlist, Referral, Verification, AccessCode
from .helpers import send_winners_mail


admin.site.unregister(DjangoUser)
admin.site.unregister(DjangoGroup)


@admin.register(DjangoUser)
class DefaultUserAdmin(BaseUserAdmin, ModelAdmin):
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


@admin.action(description="Sends mail to selected users")
def send_mail(modeladmin, request, queryset):
    """
    Action to send mail to selected users.

    Args:
        modeladmin (ModelAdmin): Admin model instance.
        request (HttpRequest): Request object.
        queryset (QuerySet): Queryset of selected users.
    """
    for query in queryset:
        access_code = get_random_string(length=16)
        while AccessCode.objects.filter(code=access_code).exists():
            access_code = get_random_string(length=16)

        access_code = access_code.upper()

        accesscode_serializer = AccessCodeSerializer(
            data={"code": access_code, "user": query.user.id}
        )
        if accesscode_serializer.is_valid():
            accesscode_serializer.save()

            send_winners_mail(query.user.name, query.user.email, access_code)
        else:
            print(accesscode_serializer.errors)
            return


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
    actions = [send_mail]


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


@admin.register(AccessCode)
class AccessCodeAdmin(ModelAdmin):
    """
    Administration interface options for AccessCode model.

    - Displays access code and associated user.
    - Allows searching by user name.
    - Filters available for access code.
    """

    list_display = ("code", "user")
    search_fields = ("user__name",)
    list_filter = ("code",)
