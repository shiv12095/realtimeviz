from django.http import JsonResponse

def index(request):
    return JsonResponse({"app": "consumer", "message": "Hello world"})
