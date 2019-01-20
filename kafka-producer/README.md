# KafkaProducer

#### Introduction

This components polls the [endpoint](https://github.com/ubahnverleih/WoBike/issues/9#issuecomment-363456750) every minute and pushes the data collected to a Kafka queue

#### Set Up

##### Config Setup
The appropriate properties have to be setup in `producer/config/dev.json`

This internally uses [Celery](http://docs.celeryproject.org/en/latest/index.html) with Redis as its internal task queue. Configure the following properties in `producer/producer/settings.py`

- CELERY_BROKER_URL
- CELERY_RESULT_BACKEND

##### Using Docker

The easiest way to run this setup is to build the Docker image, which installs all the required packages and setups up the required log directories.

###### Build Docker Image
Build the docker image using the command
`Docker build . -t kafka-producer`

###### Run the Image
Start the backend using the command `sudo docker run --name producer --restart always -d -p 8002:8000 -v producer_data:/logs/producer kafka-producer`

##### Using Python3

Alternatively you can do the following

###### Install the packages
Run `pip install -r requirements.txt`

###### Run Server
Start the server using the `start.sh` script
