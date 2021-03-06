import logging

class Logger:

    LOG_MESSAGE_FORMAT = "%(asctime)s %(message)s"
    LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
    LOG_FOLDER = "/logs/consumer/"

    def __init__():
        pass

    @staticmethod
    def get_logger(name):
        logging.basicConfig(filename=Logger.LOG_FOLDER + "info.log", level=logging.INFO, format=Logger.LOG_MESSAGE_FORMAT, datefmt=Logger.LOG_DATE_FORMAT)
        logging.basicConfig(filename=Logger.LOG_FOLDER + "error.log", level=logging.ERROR, format=Logger.LOG_MESSAGE_FORMAT, datefmt=Logger.LOG_DATE_FORMAT)
        return logging.getLogger(name)
