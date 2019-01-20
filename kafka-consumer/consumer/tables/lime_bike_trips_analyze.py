class LimeBikeTripsAnalyze:

    LIME_BIKE_TRIPS_ANALYZE = "lime_bike_trips_analyze"

    def __init__(self, conn):
        self.conn = conn

    def insert_row(self, data):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO LIME_BIKE_TRIPS_ANALYZE (vehicle_id, start_time, end_time, src, dest, duration, vehicle_type, distance)
            VALUES (%s, to_timestamp(%s), to_timestamp(%s), ST_SetSRID(ST_MakePoint(%s, %s), 3857), ST_SetSRID(ST_MakePoint(%s, %s), 3857), %s, %s, %s, %s, ST_SetSRID(ST_GeomFromText(%s), 3857), %s)
            """,
            (data['vehicle_id'], data['start_time'], data['end_time'], float(data['src']['longitude']), float(data['src']['latitude']), float(data['dest']['longitude']), float(data['dest']['latitude']), data['duration'], data['vehicle_type'], data['distance'])
        )
        conn.commit()
        cursor.close()
