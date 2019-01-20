import os
from celery import Celery
import celery.signals

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'producer.settings')

app = Celery('producer')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')


@celery.signals.setup_logging.connect
def on_celery_setup_logging(**kwargs):
    pass

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
