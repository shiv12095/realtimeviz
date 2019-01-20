from utils import Logger
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class KafkaSocketBaseTask:

    def __init__(self, processor, poll_timeout_ms=10000, commit=True):
        self.poll_timeout_ms = poll_timeout_ms
        self.processor = processor
        self.commit = commit
        self.logger = Logger.get_logger(__name__)
        self.channel_layer = get_channel_layer()

    def consume(self):
        consumer = self.processor.get_kafka_consumer()
        while True:
            data = consumer.poll(timeout_ms=self.poll_timeout_ms)
            processed = []
            if data:
                try:
                    count = 0
                    dict_key = list(data.keys())[0]
                    responses = data[dict_key]
                    for response in responses:
                        processed.append(self.processor.process(response))
                        count = count + 1
                    if self.commit:
                        self.processor.get_kafka_consumer().commit()
                    self.logger.info("Processed %s records for processor task %s", count, self.processor)
                    self.__send_data_to_socket(processed)
                except Exception as ex:
                    self.logger.error("Failed process task %s with error %s", self.processor, str(ex))

    def __send_data_to_socket(self, data):
        async_to_sync(self.channel_layer.group_send)(
            self.processor.get_socket_group(),
            {
                "type": "send.datapoint",
                "data": data,
            }
        )
