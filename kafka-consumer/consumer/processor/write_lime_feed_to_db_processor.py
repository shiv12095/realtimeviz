from utils import Constants
from adapter import KafkaAdapter, DBAdapter
from tables import LimeBikeFeed

class WriteLimeBikeFeedToDBProcessor:

    def __init__(self):
        self.db_adapter = DBAdapter()
        self.kafka_adapter = KafkaAdapter()
        self.lime_bike_feed = LimeBikeFeed(self.db_adapter.get_db_connection())
        self.lime_bike_feed_kafka_topic = Constants.KAFKA_LIME_BIKE_FEED_TOPIC
        self.lime_bike_trips_kafka_topic = Constants.KAFKA_LIME_BIKE_TRIP_TOPIC
        self.kafka_consumer_group_id = "lime_bike_feed_db_consumer"
        self.kafka_producer = self.kafka_adapter.get_producer()
        self.kafka_consumer = self.kafka_adapter.get_consumer(
            topic=self.lime_bike_feed_kafka_topic,
            group_id=self.kafka_consumer_group_id,
        )
        return

    def process(self, response):
        value = response.value
        row = {**value, **value['attributes']}
        row['vehicle_id'] = row['id']
        self.lime_bike_feed.insert_row(row)
        self.kafka_producer.send(self.lime_bike_trips_kafka_topic, key=row['vehicle_id'].encode(), value=row)
        self.kafka_producer.flush()

    def get_kafka_consumer(self):
        return self.kafka_consumer

    def __str__(self):
        return "WriteLimeBikeFeedToDBProcessor"
