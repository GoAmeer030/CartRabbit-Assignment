"""
This file contains the models for the core app.

Classes:
    User: Model for storing user details.
    Waitlist: Model for storing user waitlist position.
    Referral: Model for storing user referrals.

Signals:
    create_waitlist: Signal to create a waitlist entry for a new user.
"""

from django.db import models
from django.utils.crypto import get_random_string


class User(models.Model):
    """Model for storing user details.

    Args:
        models (django.db.models): Django model class.

    Attributes:
        id (int): Auto-incremented primary key.
        name (str): Name of the user.
        email (str): Email of the user.
        created_at (datetime): Date and time of user creation.
        referral_code (str): Unique referral code for the user.
        referral_count (int): Number of referrals made by the user.
        is_verified (bool): Flag to check if the user is verified.
        is_deleted (bool): Flag to check if the user is deleted (Soft Delete).
    """

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False, blank=False)
    email = models.EmailField(unique=True, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    referral_code = models.CharField(max_length=8, unique=True, null=True, blank=False)
    referral_count = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.referral_code:
            random_code = get_random_string(length=8)

            while User.objects.filter(referral_code=random_code).exists():
                random_code = get_random_string(length=8)

            self.referral_code = random_code
        super().save(*args, **kwargs)

    class Meta:
        db_table = "user"


class Waitlist(models.Model):
    """Model for storing user waitlist position.

    Args:
        models (django.db.models): Django model class.

    Attributes:
        user (ForeignKey): User foreign key.
        position (int): Position of the user in the waitlist
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    position = models.IntegerField(default=99, unique=True, null=False, blank=False)

    def __str__(self):
        return f"{User.name} - {self.position}"

    class Meta:
        db_table = "waitlist"


class Referral(models.Model):
    """Model for storing user referrals.

    Args:
        models (django.db.models): Django model class.

    Attributes:
        referrer (ForeignKey): User who referred.
        referree (ForeignKey): User who was referred.
        created_at (datetime): Date and time of referral creation
    """

    referrer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="referrer"
    )
    referee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="referred")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.name} - {self.referee.name}"

    class Meta:
        db_table = "referral"


class Verification(models.Model):
    unique_code = models.CharField(max_length=6, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.unique_code}"

    class Meta:
        db_table = "verification"
