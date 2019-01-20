from utils import Constants, TimeUtils
from adapter import KafkaAdapter, DBAdapter
from datetime import datetime
import pytz

class LimeBikeSocketFeedProcessor:

    def __init__(self):
        self.kafka_adapter = KafkaAdapter()
        self.kafka_consumer_group_id = "lime_bike_socket_feed"
        self.kafka_consumer = self.kafka_adapter.get_consumer(
            topic=Constants.KAFKA_LIME_BIKE_TRIP_ANALYZE_TOPIC,
            group_id=self.kafka_consumer_group_id,
            auto_offset_reset="latest"
        )

    def process(self, response):
        trip = response.value
        start_time = trip['start_time']
        end_time = trip['end_time']
        val = {
            "vehicle_id": trip['vehicle_id'],
            "start_time": start_time,
            "start_time_day_w": self.__get_day_of_week(start_time),
            "start_time_day_m": self.__get_day_of_month(start_time),
            "start_time_h": self.__get_hour_of_day(start_time),
            "end_time": end_time,
            "end_time_day_w": self.__get_day_of_week(end_time),
            "end_time_day_m": self.__get_day_of_month(end_time),
            "end_time_h": self.__get_hour_of_day(end_time),
            "duration": trip['duration'],
            "distance": 0,
            "stops": 0,
            "type": trip['vehicle_type'],
            "src": trip['src'],
            "dest": trip['dest'],
            "timestamps": [],
            "route": [],
            "start_time_str": TimeUtils.format_timestamp(start_time),
            "end_time_str": TimeUtils.format_timestamp(end_time)
        }
        return val

    def get_kafka_consumer(self):
        return self.kafka_consumer

    def get_socket_group(self):
        return Constants.SOCKET_LIME_BIKE_FEED_GROUP

    def __get_hour_of_day(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz=pytz.timezone('America/New_York'))
        return time_tuple.hour

    def __get_day_of_month(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz=pytz.timezone('America/New_York'))
        return time_tuple.day

    def __get_day_of_week(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz=pytz.timezone('America/New_York'))
        return time_tuple.weekday()

    def __str__(self):
        return "LimeBikeSocketFeedProcessor"
