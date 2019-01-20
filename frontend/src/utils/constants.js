export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const LIME_DATA_ID = "lime_trip";
export const LIME_VEHICLE_ID = "vehicle_id";

export const MODE_REAL_TIME = 1;
export const MODE_HISTORICAL = 0;

export const MAP_HOSPITAL_AREA = "map_hospital_area";
export const MAP_PUBLIC_SCHOOL = "map_public_school";
export const MAP_NEIGHBOURHOOD_CLUSTERS = "map_neighbourhood_clusters";
export const MAP_POLICE_SECTORS = "map_police_sector";
export const MAP_UNIVERSITIES_AND_COLLEGES = "map_colleges_universities";
export const MAP_CIRCULATOR_STOPS = "map_circulator_stops";
export const MAP_MUSEUMS = "map_museums";
export const MAP_PARKS_AND_REC = "map_parks_rec";
export const MAP_METRO_STATIONS = "map_metro_stations";

export const VEHICLE_TYPE_SCOOTER = "scooter";
export const VEHICLE_TYPE_BIKE = "bike";

export const CSS_VISIBLE = "visible";
export const CSS_HIDDEN = "hidden";

import UNIVERSITIES_COLLEGES_GEOJSON from '../maps/universities_colleges.json';
import PUBLIC_SCHOOLS_GEOJSON from '../maps/public_schools.json';
import HOSPITAL_AREA_GEOJSON from '../maps/hospital_areas.json';
import POLICE_SECTORS_GEOJSON from '../maps/police_sectors.json';
import NEIGHBOURHOOD_CLUSTERS_GEOJSON from '../maps/neighbourhood_clusters.json';
import CIRCULATOR_STOPS_GEOJSON from '../maps/circulator_stops.json';
import MUSEUMS_GEOJSON from '../maps/museums.json';
import PARKS_AND_REC_GEOJSON from '../maps/parks_rec.json';
import METRO_STATIONS_GEOJSON from '../maps/metro_stations.json';

export const MAP_ID_TO_GEO_JSON = {
  map_colleges_universities: {
    geo: UNIVERSITIES_COLLEGES_GEOJSON,
    label: 'Universities and Colleges'
  },
  map_public_school: {
    geo: PUBLIC_SCHOOLS_GEOJSON,
    label: 'Public Schools'
  },
  map_hospital_area: {
    geo: HOSPITAL_AREA_GEOJSON,
    label: 'Hospital Areas'
  },
  map_police_sector: {
    geo: POLICE_SECTORS_GEOJSON,
    label: 'Police Sectors'
  },
  map_neighbourhood_clusters: {
    geo: NEIGHBOURHOOD_CLUSTERS_GEOJSON,
    label: 'Neighbourhood Clusters'
  },
  map_circulator_stops: {
    geo: CIRCULATOR_STOPS_GEOJSON,
    label: 'DC Circulator Stops'
  },
  map_museums: {
    geo: MUSEUMS_GEOJSON,
    label: 'Museums'
  },
  map_parks_rec: {
    geo: PARKS_AND_REC_GEOJSON,
    label: 'Parks and Recreation'
  },
  map_metro_stations: {
    geo: METRO_STATIONS_GEOJSON,
    label: 'Metro Stations'
  }
}

export const ZOOM_LEVEL_LAT_LONG_MAP = {
  12: {
    lat: [-0.15, 0.07],
    lon: [-0.2, 0.2]
  },
  13: {
    lat: [-0.05, 0.03],
    lon: [-0.08, 0.05]
  },
  14: {
    lat: [-0.015, 0.013],
    lon: [-0.02, 0.02]
  },
  15: {
    lat: [-0.0005, 0.0003],
    lon: [-0.01, 0.01]
  }
}

export const ZOOM_LEVEL_LIMIT_MAP = {
  12: 1000,
  13: 10000,
  14: 50000,
  15: 1000000
}

export const BACKEND_URL = "127.0.0.1:8000"
export const MAPBOX_TOKEN = "MAPBOX_TOKEN"
