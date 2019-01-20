#!/bin/bash

# Make the log dir if it does not exist
mkdir -p /logs/producer

# Start Gunicorn processes
echo Starting Gunicorn.
cd producer && gunicorn producer.wsgi --bind 0.0.0.0:8000 --workers $GUNICORN_WORKERS &

# Start Celery worker
echo Starting Celery worker
cd producer && celery -A producer  worker -l  info -B
