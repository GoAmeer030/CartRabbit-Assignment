from django.conf import settings
from django.core.mail import send_mail
from django.db import models
from celery import shared_task

from .serializers import WaitlistSerializer, ReferralSerializer
from .models import User, Waitlist


@shared_task
def send_email(subject, message, recipient_list):
    send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)


@shared_task
def create_waitlist(user_id):
    last_position = Waitlist.objects.aggregate(last_position=models.Max("position"))[
        "last_position"
    ]
    position = (last_position or 98) + 1

    wait_serializer = WaitlistSerializer(data={"user": user_id, "position": position})
    if wait_serializer.is_valid():
        wait_serializer.save()
    else:
        print(wait_serializer.errors)


@shared_task
def update_waitlist(user_id):
    waitlist = Waitlist.objects.filter(user=user_id).first()

    if waitlist:
        update_position = waitlist.position - 1
        existing_waitlist_entry = Waitlist.objects.filter(
            position=update_position
        ).first()

        if existing_waitlist_entry:
            user_referral_count = User.objects.get(id=user_id).referral_count
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


@shared_task
def create_referrals(referral_code, referee_id):
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
