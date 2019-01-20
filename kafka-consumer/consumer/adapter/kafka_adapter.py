import json
from kafka import KafkaProducer
from kafka import KafkaConsumer
from utils import ServerConfig

class KafkaAdapter:

    SERVER_CONFIG = ServerConfig.SERVER_CONFIG

    def __init__(self):
        self.KAFKA_BOOTSTRAP_SERVERS = KafkaAdapter.SERVER_CONFIG['KAFKA_BOOTSTRAP_SERVERS']
        self.KAFKA_RETRIES = 3
        self.KAFKA_OFFSET_RESET = 'earliest'

    def get_consumer(self, topic, group_id, auto_offset_reset=None, enable_auto_commit=False):
        if auto_offset_reset is None:
            auto_offset_reset = self.KAFKA_OFFSET_RESET

        consumer = KafkaConsumer(
            topic,
            group_id=group_id,
            enable_auto_commit=enable_auto_commit,
            auto_offset_reset=auto_offset_reset,
            value_deserializer=lambda m: json.loads(m.decode('ascii')),
            bootstrap_servers=self.KAFKA_BOOTSTRAP_SERVERS
        )
        return consumer

    def get_producer(self):
        producer = KafkaProducer(
            value_serializer=lambda m: json.dumps(m).encode('ascii'),
            retries=self.KAFKA_RETRIES,
            bootstrap_servers=self.KAFKA_BOOTSTRAP_SERVERS
        )
        return producer
