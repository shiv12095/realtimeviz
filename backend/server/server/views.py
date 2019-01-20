import json

from django.http import JsonResponse
from api import LimeBikeTripsAnalyzeAPI
from adapter import DBAdapter
from pprint import pprint

db_adapter = DBAdapter()
db_connection = db_adapter.get_db_connection()
lime_bike_trips_analyze_api = LimeBikeTripsAnalyzeAPI(db_connection)

def index(request):
    return JsonResponse({"app": "server", "message": "Hello world"})

def get_lime_trips_analyze(request):
    if request.method == "POST":
        params = json.loads(request.body)
        return JsonResponse(lime_bike_trips_analyze_api.get_trips(params), safe=False)
    else:
        return JsonResponse({})
