# Backend

#### Introduction

The backend hosts APIs that are used to fetch the collected Limebike data from the SQL database.
This also runs a celery task that is used fetch live data from Kafka and share it with the frontend using sockets.

#### Set Up

##### Config Setup
The appropriate properties have to be setup in `backend/server/config/dev.json`

The Backend uses [channels](https://channels.readthedocs.io/en/latest/) to setup a socket connection with the frontend. This socket connection is used to stream realtime data.
Channels requires you to setup a Redis layer. Configure the `CHANNEL_LAYERS` property in `backend/server/settings.py`

##### Using Docker

The easiest way to run this setup is to build the Docker image, which installs all the required packages and setups up the required log directories.

###### Build Docker Image
Build the docker image using the command
`Docker build . -t server`

###### Run the Image
Start the backend using the command `sudo docker run --name server --restart always  -d -p 8003:8000 server`

##### Using Python3

Alternatively you can do the following

###### Install the packages
Run `pip install -r requirements.txt`

###### Run Server
Start the server using the `start.sh` script
