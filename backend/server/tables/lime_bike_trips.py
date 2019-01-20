from postgis import Point
from utils import Constants

class LimeBikeTrips:

    LIME_BIKE_FEED_TABLE = "lime_bike_trips"

    PARAMS_MAP = Constants.PARAMS_MAP

    def __init__(self, conn):
        self.conn = conn
        self.column_map = {
            "dur": "duration",
            "src": "src",
            "dest": "dest",
            "v_t": "vehicle_type",
            "v_id": "vehicle_id"
        }

    def insert_row(self, data):
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO LIME_BIKE_TRIPS (vehicle_id, start_time, end_time, src, dest, duration, vehicle_type, distance)
            VALUES (%s, to_timestamp(%s), to_timestamp(%s), point(%s, %s), point(%s, %s), %s, %s, %s)
            """,
            (data['vehicle_id'], data['start_time'], data['end_time'], float(data['src']['latitude']), float(data['src']['longitude']), float(data['dest']['latitude']), float(data['dest']['longitude']), data['duration'], data['vehicle_type'], data['distance'])
        )
        self.conn.commit()
        cursor.close()

    def get_last_trip(self, trip):
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT * FROM LIME_BIKE_TRIPS WHERE vehicle_id = (%s) AND end_time < to_timestamp(%s) ORDER BY end_time DESC LIMIT 1
            """,
            (trip['vehicle_id'], row['end_time'])
        )
        return cursor.fetchone()

    def get_trips(self, request):
        cursor = self.conn.cursor()
        query  = "SELECT * FROM LIME_BIKE_TRIPS WHERE start_time >= to_timestamp(%s) AND end_time <= to_timestamp(%s) "
        query_params = (request['start_time'], request['end_time'])
        for req in request['params']:
            query = query + self.__get_query(req)
            if isinstance(req['value'], list):
                query_params = query_params + (tuple(req['value']),)
            else:
                query_params = query_params + (req['value'],)

        if 'limit' in request:
            query = query + " LIMIT " + str(request['limit'])
        cursor.execute(query, query_params)
        res = cursor.fetchall()
        return self.__parse_get_trips_result(res)

    def __get_query(self, request):
        if request['field'] not in self.column_map:
            return ""
        if isinstance(request['value'], list):
            return " AND " + self.column_map[request['field']] + " IN %s"
        else:
            return " AND " + self.column_map[request['field']] + " " + LimeBikeTrips.PARAMS_MAP[request['operator']] + " %s"

    def __parse_get_trips_result(self, trips):
        res = []
        for trip in trips:
            parsed = {
                "vehicle_id": trip[1],
                "start_time": trip[2].timestamp(),
                "end_time": trip[3].timestamp(),
                "src": self.__get_coordinates(trip[4]),
                "dest": self.__get_coordinates(trip[5]),
                "duration": int(trip[6]),
                "vehicle_type": trip[7]
            }
            res.append(parsed)
        return res

    def __get_coordinates(self, string):
        string = string[1:-1]
        arr = string.split(",")
        return {"lat": float(arr[0]), "lon": float(arr[1])}
