import json
from celery import task
from adapter import KafkaAdapter
from task_helper import LimeBikeTaskHelper

lime_bike_task_helper = LimeBikeTaskHelper()

@task()
def lime_bike_feed_task():
    lime_bike_task_helper.push_lime_bike_feed_to_kafka()
