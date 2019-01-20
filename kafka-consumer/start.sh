#!/bin/bash

# Make the log dir if it does not exist
mkdir -p /logs/producer

# Start Gunicorn processes
echo Starting Gunicorn.
cd consumer && gunicorn consumer.wsgi --bind 0.0.0.0:8000 --workers $GUNICORN_WORKERS
