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
