from django.conf import settings
from django.core.mail import send_mail
from django.db import models
from celery import shared_task

from .serializers import WaitlistSerializer
from .models import User, Waitlist


@shared_task
def send_email(subject, message, recipient_list):
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)


@shared_task
def create_waitlist(user_id):
    latest_position = Waitlist.objects.aggregate(
        latest_position=models.Max("position")
    )["latest_position"]
    position = (latest_position or 98) + 1

    wait_serializer = WaitlistSerializer(data={"user": user_id, "position": position})
    if wait_serializer.is_valid():
        wait_serializer.save()
    else:
        print(wait_serializer.errors)
