import _thread
from processor import LimeBikeSocketFeedProcessor
from .kafka_socket_base_task import KafkaSocketBaseTask

def __lime_bike_feed_socker_task():
    processor = LimeBikeSocketFeedProcessor()
    kafka_socket_base_task = KafkaSocketBaseTask(processor)
    _thread.start_new_thread(kafka_socket_base_task.consume, ())

def run_tasks():
    __lime_bike_feed_socker_task()
