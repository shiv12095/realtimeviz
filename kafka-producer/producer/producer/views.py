from django.http import JsonResponse

def index(request):
    return JsonResponse({"app": "producer", "message": "Hello world"})
