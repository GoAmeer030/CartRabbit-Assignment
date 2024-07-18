from django.contrib import admin
from .models import User, Waitlist, Referral, Verification


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
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
class WaitlistAdmin(admin.ModelAdmin):
    list_display = ("user", "position")
    search_fields = ("user__name",)
    list_filter = ("position",)


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ("referrer", "referee", "created_at")
    search_fields = ("referrer__name", "referee__name")
    list_filter = ("created_at",)


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = ("unique_code", "user")
    search_fields = ("user__name",)
    list_filter = ("unique_code",)
