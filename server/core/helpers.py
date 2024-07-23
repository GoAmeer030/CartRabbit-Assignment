"""
This module contains some helper functions for the Django application.

Functions:
- send_verification_mail(code, mail): Send a verification email with a unique code.
"""

import os

from django.template.loader import render_to_string

from .tasks import send_html_email


def send_verification_mail(code, mail):
    """
    Send a verification email with a unique code.

    Args:
        code (str): The unique verification code.
        mail (str): The recipient's email address.
    """
    subject = "Verification Email - SpotHot"
    client_url = os.getenv("CLIENT_URL")

    context = {
        "client_url": client_url,
        "verification_url": f"{client_url}/verify/?code={code}",
        "type_of_action": "Email Verification",
    }
    html_content = render_to_string("verification-email.html", context)

    recipient_list = [mail]

    send_html_email.delay(subject, html_content, recipient_list)


def send_winners_mail(name, mail, code):
    """
    Send an email to the selected user.

    Args:
        name (str): The name of the selected user.
        mail (str): The email address of the selected user.
        code (str): The access code for the user.
    """
    subject = "Congratulations You Are Selected! - SpotHot"

    context = {
        "username": name,
        "access_code": code,
        "type_of_action": "Selection",
    }

    html_content = render_to_string("winner-email.html", context)
    recipient_list = [mail]

    send_html_email.delay(subject, html_content, recipient_list)
