CREATE TABLE lime_bike_trips_analyze (
    id integer NOT NULL,
    vehicle_id character varying(20) NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    duration integer NOT NULL,
    distance real NOT NULL,
    points integer NOT NULL,
    vehicle_type character varying(10) NOT NULL,
    timestamps character varying NOT NULL,
    src geometry(Point,4326),
    dest geometry(Point,4326),
    route geometry(LineString,4326)
);

CREATE SEQUENCE lime_bike_trips_analyze_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE lime_bike_trips_analyze_id_seq OWNED BY lime_bike_trips_analyze.id;

ALTER TABLE ONLY lime_bike_trips_analyze ALTER COLUMN id SET DEFAULT nextval('lime_bike_trips_analyze_id_seq'::regclass);

ALTER TABLE ONLY lime_bike_trips_analyze
    ADD CONSTRAINT lime_bike_trips_analyze_pkey PRIMARY KEY (id);

CREATE INDEX lime_bike_trips_analyze_dest_idx ON public.lime_bike_trips_analyze USING gist (dest);

CREATE INDEX lime_bike_trips_analyze_distance_idx ON public.lime_bike_trips_analyze USING btree (distance);

CREATE INDEX lime_bike_trips_analyze_duration_idx ON public.lime_bike_trips_analyze USING btree (duration);

CREATE INDEX lime_bike_trips_analyze_end_time_idx ON public.lime_bike_trips_analyze USING btree (end_time);

CREATE INDEX lime_bike_trips_analyze_points_idx ON public.lime_bike_trips_analyze USING btree (points);

CREATE INDEX lime_bike_trips_analyze_src_idx ON public.lime_bike_trips_analyze USING gist (src);

CREATE INDEX lime_bike_trips_analyze_start_time_idx ON public.lime_bike_trips_analyze USING btree (start_time);

CREATE INDEX lime_bike_trips_analyze_type_idx ON public.lime_bike_trips_analyze USING btree (vehicle_type);
