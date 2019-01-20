FROM python:3.6-onbuild

ENV GUNICORN_WORKERS=3

COPY start.sh /start.sh

EXPOSE 8000

CMD ["/start.sh"]
