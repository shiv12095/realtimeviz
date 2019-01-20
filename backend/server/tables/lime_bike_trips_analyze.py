from datetime import datetime
from utils import TimeUtils, Constants
import pytz

class LimeBikeTripsAnalyze:

    LIME_BIKE_TRIPS_ANALYZE = "lime_bike_trips_analyze"

    PARAMS_MAP = Constants.PARAMS_MAP

    def __init__(self, conn):
        self.conn = conn
        self.column_map = {
            "dur": "duration",
            "src": "src",
            "dest": "dest",
            "dist": "distance",
            "v_t": "vehicle_type",
            "v_id": "vehicle_id",
            "lat_s": "ST_Y(src)",
            "lng_s": "ST_X(src)",
            "lat_d": "ST_Y(dest)",
            "lng_d": "ST_X(dest)"
        }

    def get_trips(self, request):
        cursor = self.conn.cursor()
        query  = "SELECT * FROM LIME_BIKE_TRIPS_ANALYZE WHERE start_time >= to_timestamp(%s) AND end_time <= to_timestamp(%s)"
        query_params = (request['start_time'], request['end_time'])
        for req in request['params']:
            query = query + self.__get_query(req)
            if isinstance(req['value'], list):
                query_params = query_params + (tuple(req['value']),)
            else:
                query_params = query_params + (req['value'],)

        query = query + " ORDER BY (%s) DESC"
        query_params = query_params + (2,)

        if 'limit' in request:
            query = query + " LIMIT (%s)"
            query_params = query_params + (request['limit'],)

        cursor.execute(query, query_params)
        res = cursor.fetchall()
        return self.__parse_get_trips_result(res)

    def __get_query(self, request):
        if request['field'] not in self.column_map:
            return ""
        if isinstance(request['value'], list):
            return " AND " + self.column_map[request['field']] + " IN %s"
        else:
            return " AND " + self.column_map[request['field']] + " " + LimeBikeTripsAnalyze.PARAMS_MAP[request['operator']] + " %s"

    def __parse_get_trips_result(self, trips):
        res = []
        for trip in trips:
            res.append(self.__parse_trip(trip))
        return res

    def __parse_trip(self, record):
        start_time_tuple = record[2]
        end_time_tuple = record[3]
        start_time = start_time_tuple.timestamp()
        end_time = end_time_tuple.timestamp()
        val = {
            "vehicle_id": record[1],
            "start_time": start_time,
            "start_time_day_w": self.__get_day_of_week(start_time),
            "start_time_day_m": self.__get_day_of_month(start_time),
            "start_time_h": self.__get_hour_of_day(start_time),
            "end_time": end_time,
            "end_time_day_w": self.__get_day_of_week(end_time),
            "end_time_day_m": self.__get_day_of_month(end_time),
            "end_time_h": self.__get_hour_of_day(end_time),
            "duration": int(record[4]),
            "distance": float(record[5]),
            "type": record[6],
            "src": self.__get_coordinates(record[7]),
            "dest": self.__get_coordinates(record[8]),
            "start_time_str": TimeUtils.format_timestamp(start_time),
            "end_time_str": TimeUtils.format_timestamp(end_time)
        }
        return val

    def __get_route(self, record):
        route = []
        for rec in record:
            route.append(self.__get_coordinates(rec))
        return route

    def __get_coordinates(self, coords):
        return {'latitude': coords[1], "longitude": coords[0]}

    def __get_hour_of_day(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz= pytz.timezone('America/New_York'))
        return time_tuple.hour

    def __get_day_of_month(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz= pytz.timezone('America/New_York'))
        return time_tuple.day

    def __get_day_of_week(self, timestamp):
        time_tuple = datetime.fromtimestamp(timestamp, tz= pytz.timezone('America/New_York'))
        return time_tuple.weekday()
