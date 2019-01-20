from utils import Constants, Logger
from adapter import KafkaAdapter, DBAdapter
from tables import LimeBikeFeed, LimeBikeTripsAnalyze
from utils import ServerConfig

class CreateLimeBikeTripProcessor:

    SERVER_CONFIG = ServerConfig.SERVER_CONFIG

    def __init__(self):
        self.db_adapter = DBAdapter()
        self.kafka_adapter = KafkaAdapter()
        self.logger = Logger.get_logger(__name__)
        self.db_connection = self.db_adapter.get_db_connection()
        self.lime_bike_feed = LimeBikeFeed(self.db_connection)
        self.lime_bike_trips_analyze = LimeBikeTripsAnalyze(self.db_connection)
        self.lime_bike_trips_kafka_topic = Constants.KAFKA_LIME_BIKE_TRIP_TOPIC
        self.kafka_consumer_group_id = "lime_bike_trip_consumer"
        self.kafka_consumer = self.kafka_adapter.get_consumer(
            topic=self.lime_bike_trips_kafka_topic,
            group_id=self.kafka_consumer_group_id,
        )
        self.kafka_producer = self.kafka_adapter.get_producer()
        self.lime_bike_trip_analyze_kafka_topic = Constants.KAFKA_LIME_BIKE_TRIP_ANALYZE_TOPIC

    def process(self, response):
        value = response.value
        row = {**value, **value['attributes']}
        row['vehicle_id'] = row['id']
        prev_row = self.lime_bike_feed.get_last_point(row)
        if prev_row:
            resp = self.__is_valid_trip(row, prev_row)
            if resp:
                resp["vehicle_id"] = row["id"]
                resp["plate_number"] = row["plate_number"]
                resp["type"] = row["type"]
                resp["vehicle_type"] = row["vehicle_type"]
                self.lime_bike_trips_analyze.insert_row(resp)
                self.kafka_producer.send(self.lime_bike_trip_analyze_kafka_topic, key=resp['vehicle_id'].encode(), value=resp)
                self.kafka_producer.flush()

    def get_kafka_consumer(self):
        return self.kafka_consumer

    def __is_valid_trip(self, curr_point, prev_point):
        try:
            time_tuple = prev_point[4]
            start_time = time_tuple.timestamp()
            end_time = curr_point['timestamp']
            src_coords = self.__get_coordinates(prev_point[6])
            src = {
                "latitude": float(src_coords["latitude"]),
                "longitude": float(src_coords["longitude"])
            }
            dest = {
                "latitude": float(curr_point["latitude"]),
                "longitude": float(curr_point["longitude"])
            }
            distance = self.__calculate_distance(src, dest)
            if(src["latitude"] != dest['latitude'] or src["longitude"] != dest['longitude']):
                return {
                    "start_time": int(start_time),
                    "end_time": end_time,
                    "src": src,
                    "dest": dest,
                    "duration": end_time - int(start_time),
                    "distance": distance
                }
            else:
                return None
        except Exception as ex:
            self.logger.error("Unable to check if trip is valid due to exception %s for prev_point %s and curr_point %s", str(ex), prev_point, curr_point)
            return None

    def __get_coordinates(self, string):
        string = string[1:-1]
        arr = string.split(",")
        return {"latitude": arr[0], "longitude": arr[1]}

    def __calculate_distance(self, src, dest):
        API_KEY = CreateLimeBikeTripProcessor.SERVER_CONFIG.BING_MAPS_API_KEY
        URL = 'https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=' + str(src['latitude']) + ',' + str(src['longitude']) + '&destinations=' + str(dest['latitude']) + ',' + str(dest['longitude']) + '&travelMode=driving&key=' + API_KEY
        request = urllib.request.Request(URL)
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode(encoding="utf-8"))
        try:
            if 'resourceSets' in result:
                resource_sets = result['resourceSets']
                if len(resource_sets) > 0:
                    resources = resource_sets[0]['resources'][0]
                    results = resources['results']
                    if len(results) > 0:
                        result = results[0]
                        return result['travelDistance'] * 1000
        except Exception as ex:
            return -1

    def __str__(self):
        return "CreateLimeBikeTripProcessor"
