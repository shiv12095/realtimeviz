"""
WSGI config for consumer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/howto/deployment/wsgi/
"""

import os
from tasks.consumer_tasks import run_tasks
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'consumer.settings')

application = get_wsgi_application()

run_tasks()
