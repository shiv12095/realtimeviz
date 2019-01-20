import psycopg2
from postgis.psycopg import register
from utils import ServerConfig

class DBAdapter:

    SERVER_CONFIG = ServerConfig.SERVER_CONFIG

    def __init__(self):
        self.POSTGRES_HOST = DBAdapter.SERVER_CONFIG['POSTGRES_HOST']
        self.POSTGRES_DATABASE = DBAdapter.SERVER_CONFIG['POSTGRES_DATABASE']
        self.POSTGRES_USER = DBAdapter.SERVER_CONFIG['POSTGRES_USER']
        self.POSTGRES_PASS = DBAdapter.SERVER_CONFIG['POSTGRES_PASS']

    def get_db_connection(self):
        conn = psycopg2.connect(host=self.POSTGRES_HOST,
                                database=self.POSTGRES_DATABASE,
                                user=self.POSTGRES_USER,
                                password=self.POSTGRES_PASS)
        register(conn)
        return conn
