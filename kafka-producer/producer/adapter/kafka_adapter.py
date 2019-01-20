import json
from kafka import KafkaProducer
from utils import ServerConfig

class KafkaAdapter:

    SERVER_CONFIG = ServerConfig.SERVER_CONFIG

    def __init__(self):
        self.KAFKA_BOOTSTRAP_SERVERS = KafkaAdapter.SERVER_CONFIG['KAFKA_BOOTSTRAP_SERVERS']
        self.KAFKA_RETRIES = 3

    def get_producer(self):
        producer = KafkaProducer(
            bootstrap_servers=self.KAFKA_BOOTSTRAP_SERVERS,
            value_serializer=lambda m: json.dumps(m).encode('ascii'),
            retries=self.KAFKA_RETRIES
        )
        return producer
