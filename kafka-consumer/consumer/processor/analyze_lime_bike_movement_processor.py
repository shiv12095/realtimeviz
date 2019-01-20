from utils import Constants, Logger
from adapter import KafkaAdapter, DBAdapter
from tables import LimeBikeFeed, LimeBikeTrips

class AnalyzeLimeBikeMovementProcessor:

    def __init__(self):
        self.db_adapter = DBAdapter()
        self.logger = Logger.get_logger(__name__)
        self.db_connection = self.db_adapter.get_db_connection()
        self.kafka_consumer_group_id = "lime_bike_trip_movement_analyzer_consumer"
        self.lime_bike_trips = LimeBikeTrips(self.db_connection)
        self.kafka_consumer = self.kafka_adapter.get_consumer(
            topic=self.lime_bike_trips_kafka_topic,
            group_id=self.kafka_consumer_group_id,
        )

    def process(self, response):
        pass

    def get_kafka_consumer(self):
        return self.kafka_consumer
