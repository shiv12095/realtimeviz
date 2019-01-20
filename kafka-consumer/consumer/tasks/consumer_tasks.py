import _thread
from processor import WriteLimeBikeFeedToDBProcessor, CreateLimeBikeTripProcessor
from .kafka_base_task import KafkaBaseTask

def __lime_bike_write_to_db_task():
    processor = WriteLimeBikeFeedToDBProcessor()
    kafka_base_task = KafkaBaseTask(processor)
    _thread.start_new_thread(kafka_base_task.consume, ())

def __lime_bike_create_trips_task():
    processor = CreateLimeBikeTripProcessor()
    kafka_base_task = KafkaBaseTask(processor)
    _thread.start_new_thread(kafka_base_task.consume, ())

def run_tasks():
    __lime_bike_write_to_db_task()
    __lime_bike_create_trips_task()
