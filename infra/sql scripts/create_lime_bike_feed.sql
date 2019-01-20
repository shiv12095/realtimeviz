CREATE TABLE lime_bike_feed (
    id integer NOT NULL,
    vehicle_id character varying(20) NOT NULL,
    plate_number character varying(10),
    type character varying(10),
    point_time timestamp with time zone NOT NULL,
    vehicle_type character varying(20),
    location point NOT NULL
);

CREATE SEQUENCE "LIME_BIKE_FEED_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "LIME_BIKE_FEED_id_seq" OWNED BY lime_bike_feed.id;

ALTER TABLE ONLY lime_bike_feed ALTER COLUMN id SET DEFAULT nextval('"LIME_BIKE_FEED_id_seq"'::regclass);

ALTER TABLE ONLY lime_bike_feed
    ADD CONSTRAINT "LIME_BIKE_FEED_pkey" PRIMARY KEY (id);

CREATE UNIQUE INDEX lime_bike_feed_vehicle_id_timestamp_idx ON public.lime_bike_feed USING btree (vehicle_id, point_time);
