"""
This module defines tasks for sending emails, managing waitlists, and handling referrals in a Django application.
It utilizes Celery for asynchronous task processing.

Functions:
- send_text_email(subject, message, recipient_list): Sends an email to a list of recipients.
- send_html_email(subject, html_content, recipient_list): Sends an HTML email to a list of recipients.
- create_waitlist(user_id): Adds a user to the waitlist and assigns them a position.
- update_waitlist(user_id): Updates the position of a user in the waitlist based on certain criteria.
- create_referrals(referral_code, referee_id): Creates a referral entry and updates the referrer's count.
"""

from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from django.db import models
from celery import shared_task

from .serializers import WaitlistSerializer, ReferralSerializer
from .models import User, Waitlist


@shared_task
def send_text_email(subject, message, recipient_list):
    """
    Sends an email to a list of recipients.

    Parameters:
    - subject (str): The subject of the email.
    - message (str): The body of the email.
    - recipient_list (list): A list of email addresses to send the email to.
    """
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)


@shared_task
def send_html_email(subject, html_content, recipient_list):
    """
    Sends an HTML email to a list of recipients.

    Parameters:
    - subject (str): The subject of the email.
    - html_content (str): The HTML content of the email.
    - recipient_list (list): A list of email addresses to send the email to.
    """
    text_content = strip_tags(html_content)

    email = EmailMultiAlternatives(
        subject, text_content, to=recipient_list, from_email=settings.EMAIL_HOST_USER
    )
    email.attach_alternative(html_content, "text/html")

    email.send()


@shared_task
def create_waitlist(user_id):
    """
    Adds a user to the waitlist and assigns them a position.

    Parameters:
    - user_id (int): The ID of the user to add to the waitlist.
    """
    last_position = Waitlist.objects.aggregate(last_position=models.Max("position"))[
        "last_position"
    ]
    position = (last_position or 98) + 1

    wait_serializer = WaitlistSerializer(data={"user": user_id, "position": position})
    if wait_serializer.is_valid():
        wait_serializer.save()

        # Sending a welcome email to the user
        user = User.objects.get(id=user_id)
        subject = "Welcome - Your Spot is Confirmed!"

        context = {
            "user_name": user.name,
            "waitlist_position": position,
            "type_of_action": "Registration",
        }
        html_content = render_to_string("welcome-email.html", context)
        recipient_list = [user.email]

        send_html_email.delay(subject, html_content, recipient_list)
    else:
        print(wait_serializer.errors)


@shared_task
def update_waitlist(referrer_id, referee_name):
    """
    Updates the position of user in the waitlist based on their referral count & creation date of their waitlist entry.

    Parameters:
    - referrer_id (int): The ID of the referrer.
    - referee_name (str): The name of the user being referred
    """
    waitlist = Waitlist.objects.filter(user=referrer_id).first()

    if waitlist:
        update_position = max(waitlist.position - 1, 1)
        existing_waitlist_entry = Waitlist.objects.filter(
            position=update_position
        ).first()

        if existing_waitlist_entry:
            user_referral_count = User.objects.get(id=referrer_id).referral_count
            existing_user_referral_count = User.objects.get(
                id=existing_waitlist_entry.user.id
            ).referral_count

            print(user_referral_count, existing_user_referral_count)
            if user_referral_count > existing_user_referral_count:
                existing_waitlist_entry.position = 0
                existing_waitlist_entry.save()

                waitlist.position = update_position
                waitlist.save()

                existing_waitlist_entry.position = update_position + 1
                existing_waitlist_entry.save()

            elif user_referral_count < existing_user_referral_count:
                pass

            else:
                if waitlist.created_at < existing_waitlist_entry.created_at:
                    existing_waitlist_entry.position = 0
                    existing_waitlist_entry.save()

                    waitlist.position = update_position
                    waitlist.save()

                    existing_waitlist_entry.position = update_position + 1
                    existing_waitlist_entry.save()

                else:
                    pass
        else:
            waitlist.position = update_position
            waitlist.save()

        # Sending an email to the user about their updated position
        user = User.objects.get(id=referrer_id)
        subject = "Spot Update - SpotHot"

        context = {
            "referrer_name": user.name,
            "referrer_referral_count": user.referral_count,
            "referee_name": referee_name,
            "position": waitlist.position,
            "type_of_action": "Referral",
        }
        html_content = render_to_string("spot-update-email.html", context)
        recipient_list = [user.email]

        send_html_email.delay(subject, html_content, recipient_list)


@shared_task
def create_referrals(referral_code, referee_id):
    """
    Creates a referral entry and updates the referrer's count.

    Parameters:
    - referral_code (str): The referral code of the referrer.
    - referee_id (int): The ID of the user being referred.
    """
    referrer = User.objects.get(referral_code=referral_code)
    referrer.referral_count = referrer.referral_count + 1
    print(referrer.referral_count)
    referrer.save()

    referral_serializer = ReferralSerializer(
        data={"referrer": referrer.id, "referee": referee_id}
    )
    if referral_serializer.is_valid():
        referral_serializer.save()
    else:
        print(referral_serializer.errors)
