# KafkaConsumer

#### Introduction

This components polls the the Kafka queue and adds the raw lime bike feed and the trips created to the database

#### Set Up

##### Config Setup
The appropriate properties have to be setup in `consumer/config/dev.json`

This internally uses [Celery](http://docs.celeryproject.org/en/latest/index.html) with Redis as its internal task queue. Configure the following properties in `consumer/consumer/settings.py`

- CELERY_BROKER_URL
- CELERY_RESULT_BACKEND

##### Using Docker

The easiest way to run this setup is to build the Docker image, which installs all the required packages and setups up the required log directories.

###### Build Docker Image
Build the docker image using the command
`Docker build . -t kafka-consumer`

###### Run the Image
Start the backend using the command `sudo docker run --name consumer --restart always -d -p 8001:8000 -v producer_data:/logs/consumer kafka-consumer`

##### Using Python3

Alternatively you can do the following

###### Install the packages
Run `pip install -r requirements.txt`

###### Run Server
Start the server using the `start.sh` script
