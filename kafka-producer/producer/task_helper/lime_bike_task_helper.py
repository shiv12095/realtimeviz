import requests
import json
import time

from adapter import KafkaAdapter
from utils import Logger

class LimeBikeTaskHelper:
    LIME_BIKE_API_AUTHORIAZATION_TOKEN = 'Bearer limebike-PMc3qGEtAAXqJa'
    LIME_BIKE_API_REQUEST_PARAMS = ('region', 'Washington DC Proper')
    LIME_BIKE_API_REQUEST_URL = 'https://lime.bike/api/partners/v1/bikes'

    LIME_BIKE_FEED_KAFKA_TOPIC = 'lime_bike_feed'

    def __init__(self):
        self.logger = Logger.get_logger(__name__)
        self.kafka_adapter = KafkaAdapter()

    def get_lime_bike_data(self):
        headers = {
            'Authorization': LimeBikeTaskHelper.LIME_BIKE_API_AUTHORIAZATION_TOKEN
        }
        params = (
            LimeBikeTaskHelper.LIME_BIKE_API_REQUEST_PARAMS,
        )
        curr_time = int(time.time())
        response = requests.get(LimeBikeTaskHelper.LIME_BIKE_API_REQUEST_URL, headers = headers, params = params)
        data = json.loads(response.text)
        if 'data' not in data:
            data['data'] = []
        return {'data': data, 'time': curr_time}

    def push_lime_bike_feed_to_kafka(self):
        try:
            producer = self.kafka_adapter.get_producer()
            resp = self.get_lime_bike_data()
            curr_time = resp['time']
            data = resp['data']['data']
            count = 0
            for datapoint in data:
                datapoint['timestamp'] = curr_time
                count += 1
                producer.send(LimeBikeTaskHelper.LIME_BIKE_FEED_KAFKA_TOPIC, key=datapoint['id'].encode(), value=datapoint)
                producer.flush()
            self.logger.info("Pushed %s lime bike feed data points", count)
        except Exception as ex:
            self.logger.error("Failed to push lime bike feed data points %s", str(ex))
