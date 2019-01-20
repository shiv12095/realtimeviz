import os
import json
from django.conf import settings

class ServerConfig:
    SERVER_CONFIG = {}

    with open(os.path.join(settings.BASE_DIR, "config/dev.json")) as f:
        SERVER_CONFIG = json.load(f)
