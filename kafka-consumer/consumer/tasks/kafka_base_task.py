from utils import Logger

class KafkaBaseTask:

    def __init__(self, processor, poll_timeout_ms=10000, commit=True):
        self.poll_timeout_ms = poll_timeout_ms
        self.processor = processor
        self.commit = commit
        self.logger = Logger.get_logger(__name__)

    def consume(self):
        consumer = self.processor.get_kafka_consumer()
        while True:
            data = consumer.poll(timeout_ms=self.poll_timeout_ms)
            if data:
                try:
                    count = 0
                    dict_key = list(data.keys())[0]
                    responses = data[dict_key]
                    for response in responses:
                        self.processor.process(response)
                        count += 1
                    if self.commit:
                        self.processor.get_kafka_consumer().commit()
                    self.logger.info("Processed %s records for processor task %s", count, self.processor)
                except Exception as ex:
                    self.logger.error("Failed process task %s with error %s", self.processor, str(ex))
