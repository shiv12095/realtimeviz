#### DOCKER COMMANDS TO START APPLICATIONS

##### ZOOKEEPER
` docker run --name zookeeper --restart always -d -p 2181:2181 -p 2888:2888 -p 3888:3888 -v zookeeper_data:/datalog zookeeper`

###### ZOOKEEPER COMMANDS

`zkCli.sh -server ZOOKEEPER_IP:2181`

##### KAFKA QUEUES
Setup 3 Kafka queues for replication

`docker run --name kafka1 --restart always -d -p 9091:9091 -e KAFKA_ZOOKEEPER_CONNECT=ZOOKEEPER_IP:2181 -e KAFKA_LISTENERS=PLAINTEXT://:9091  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://KAKFA_QUEUE_URL_1:9091 -e BROKER_ID=1 -e KAFKA_LOG_DIRS=/kafka/logs -v kafka1_data:/kafka/logs wurstmeister/kafka`

`docker run --name kafka2 --restart always -d -p 9092:9092 -e KAFKA_ZOOKEEPER_CONNECT=ZOOKEEPER_IP:2181 -e KAFKA_LISTENERS=PLAINTEXT://:9092  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://KAKFA_QUEUE_URL_2:9092 -e BROKER_ID=2 -e KAFKA_LOG_DIRS=/kafka/logs -v kafka2_data:/kafka/logs wurstmeister/kafka`

`docker run --name kafka3 --restart always -d -p 9093:9093 -e KAFKA_ZOOKEEPER_CONNECT=ZOOKEEPER_IP:2181 -e KAFKA_LISTENERS=PLAINTEXT://:9093  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://KAKFA_QUEUE_URL_3:9093 -e BROKER_ID=3 -e KAFKA_LOG_DIRS=/kafka/logs -v kafka3_data:/kafka/logs wurstmeister/kafka`

###### KAFKA COMMANDS

`kafka-topics.sh --create --topic lime_bike_feed  --partitions 3 --zookeeper ZOOKEEPER_IP:2181  --replication-factor 3`

`kafka-topics.sh --create --topic lime_bike_feed_dev_test  --partitions 3 --zookeeper ZOOKEEPER_IP:2181  --replication-factor 3`

`kafka-topics.sh --create --topic lime_bike_trip  --partitions 3 --zookeeper ZOOKEEPER_IP:2181  --replication-factor 3`

`kafka-topics.sh --create --topic test  --partitions 3 --zookeeper ZOOKEEPER_IP:2181  --replication-factor 3`

`kafka-console-consumer.sh --bootstrap-server KAKFA_QUEUE_URL_1:9091 --topic lime_bike_trip_analyze  d --from-beginning`


##### POSTGRES
`docker run --name postgis --restart always -d -p 5432:5432 -e POSTGRES_USER=<USER_NAME> -e POSTGRES_PASS=<PASSWORD> -e POSTGRES_DBNAME=<DB_NAME> -e ALLOW_IP_RANGE=0.0.0.0/0 -v pg_data:/var/lib/postgresql kartoza/postgis:9.6-2.4`

###### POSTGRES COMMANDS

`psql -h POSTGRES_IP -U <Username> -d <Database>`

##### REDIS
`docker run --name redis --restart always -d -p 6379:6379 redis`
