#!/bin/bash

# Start Gunicorn processes
echo Starting Gunicorn.
cd server && gunicorn server.wsgi --bind 0.0.0.0:8000 --workers $GUNICORN_WORKERS
