from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
from sockets import LimeBikeFeedWebSocket
from tasks.consumer_tasks import run_tasks

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path('feed/lime', LimeBikeFeedWebSocket),
    ]),
})

run_tasks()
