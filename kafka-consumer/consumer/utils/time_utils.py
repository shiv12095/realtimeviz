import time
from datetime import datetime, timedelta

class TimeUtils:

    @staticmethod
    def get_current_time(time_format):
        time_tuple = datetime.now()
        string = time_tuple.strftime(time_format)
        return string

    @staticmethod
    def format_time(time_string, input_format, output_format):
        time_tuple = datetime.strptime(time_string, input_format)
        string = time_tuple.strftime(output_format)
        return string

    @staticmethod
    def format_timestamp(ts_epoch, output_format):
        ts_epoch = float(ts_epoch)
        return datetime.fromtimestamp(ts_epoch).strftime(output_format)

    @staticmethod
    def get_time_as_epoch(time_string, input_format):
        return int(time.mktime(time.strptime(time_string, input_format)))
