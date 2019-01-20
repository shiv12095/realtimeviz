from tables import LimeBikeTripsAnalyze
from utils import TimeUtils
from datetime import datetime, timedelta
from django.http import JsonResponse

class LimeBikeTripsAnalyzeAPI:

    def __init__(self, conn):
        self.conn = conn
        self.lime_bike_trips_analyze = LimeBikeTripsAnalyze(conn)

    def get_trips(self, request):
        request = self.__init_params(request)
        resp = {
            "rows": self.lime_bike_trips_analyze.get_trips(request)
        }
        return resp

    def __init_params(self, request):
        # print(request)
        if 'start_time' not in request:
            time_tuple = datetime.now() - timedelta(days=10)
            request['start_time'] = int(time_tuple.timestamp())
        else:
            request['start_time'] = request['start_time']
        if 'end_time' not in request:
            request['end_time'] = int(datetime.now().timestamp())
        else:
            request['end_time'] = request['end_time']
        if 'params' not in request:
            request['params'] = []
        request['limit'] = 1000000
        return request
