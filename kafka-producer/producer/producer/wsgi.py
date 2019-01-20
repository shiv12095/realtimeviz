"""
WSGI config for producer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from task_helper import LimeBikeTaskHelper

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'producer.settings')

application = get_wsgi_application()

lime_bike_task_helper = LimeBikeTaskHelper()

lime_bike_task_helper.push_lime_bike_feed_to_kafka()
