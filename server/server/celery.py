"""
Celery configuration file

This file contains the Celery configuration for the Django project.
"""
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

app = Celery("server")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
