from postgis import Point

class LimeBikeFeed:

    LIME_BIKE_FEED_TABLE = "lime_bike_feed"

    def __init__(self, conn):
        self.conn = conn

    def insert_row(self, row):
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO LIME_BIKE_FEED (vehicle_id, plate_number, type, vehicle_type, point_time, location)
            VALUES (%s, %s, %s, %s, to_timestamp(%s), point(%s, %s))
            """,
            (row['vehicle_id'], row['plate_number'], row['type'], row['vehicle_type'], float(row['timestamp']), float(row['latitude']), float(row['longitude']))
        )
        self.conn.commit()
        cursor.close()

    def get_last_point(self, row):
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT * FROM LIME_BIKE_FEED WHERE vehicle_id = (%s) AND point_time < to_timestamp(%s) ORDER BY point_time DESC LIMIT 1
            """,
            (row['vehicle_id'], row['timestamp'])
        )
        return cursor.fetchone()
