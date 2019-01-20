from channels.generic.websocket import AsyncJsonWebsocketConsumer
from utils import Constants
import json

class LimeBikeFeedWebSocket(AsyncJsonWebsocketConsumer):

    async def connect(self):
        await self.channel_layer.group_add(
            Constants.SOCKET_LIME_BIKE_FEED_GROUP,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            Constants.SOCKET_LIME_BIKE_FEED_GROUP,
            self.channel_name
        )

    async def receive_json(self, content):
        pass

    async def send_datapoint(self, message):
        await self.send(text_data=json.dumps({
            "rows": message['data']
        }))
