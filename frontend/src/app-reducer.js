// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import axios from 'axios';
import {createAction, handleActions} from 'redux-actions';
import {addDataToMap, addFilter, setFilter, updateVisData} from 'kepler.gl/actions';
import KeplerGlSchema from 'kepler.gl/schemas';
import Processors from 'kepler.gl/processors';
import limeConfig from './configurations/lime_config.json';
import mapFields from './configurations/lime_map_fields.json';
import moment from 'moment';
import {combinePolygons, withPolygon, differencePolygons, createBoundingBoxForScreen} from './utils/geoutils'
import geoViewport from '@mapbox/geo-viewport';

import {
  DATE_TIME_FORMAT, LIME_DATA_ID, LIME_VEHICLE_ID, MODE_REAL_TIME,
  MODE_HISTORICAL, VEHICLE_TYPE_BIKE, VEHICLE_TYPE_SCOOTER,
  CSS_HIDDEN, CSS_VISIBLE, MAP_ID_TO_GEO_JSON,
  ZOOM_LEVEL_LIMIT_MAP, BACKEND_URL
} from './utils/constants';

export const initMap = () => {
  return (dispatch, getState) => {
    const state = getState();
    const datasets = state['keplerGl']['map1']['visState']['datasets'];
    const data = {fields: mapFields, rows: []};
    const dataset = {
      data,
      info: {
        id: LIME_DATA_ID
      }
    };
    dispatch(addDataToMap({datasets: dataset, config: limeConfig}));
  }
}

export const showSuspectBikes = () => {
  return (dispatch, getState) => {
    const state = getState();
    const datasets = state['keplerGl']['map1']['visState']['datasets'];
    let oldData = [];
    if('lime_trip' in datasets && 'allData' in datasets['lime_trip']){
      oldData = datasets['lime_trip']['allData']
    }
    let tempData = [];
    oldData.forEach((record, i) => {
      if(i < 10){
        tempData.push(record[0]);
      }
    });
    dispatch(updateSuspectBikes(tempData));
    dispatch(addFilter(LIME_DATA_ID));
    dispatch(setFilter(0, 'name', 'LIME_VEHICLE_ID'));
    dispatch(setFilter(0, 'value', state.app.suspectBikes));
  }
}

export const fetchData = () => {
  return (dispatch, getState) => {
    const state = getState();
    const zoomLevel = Math.round(state.keplerGl.map1.mapState.zoom)
    const mapState = state.keplerGl.map1.mapState;
    const bounds = geoViewport.bounds(
      [mapState.longitude, mapState.latitude], mapState.zoom,
      [mapState.width, mapState.height]
    );
    const boundingPolygon = createBoundingBoxForScreen(bounds, Math.round(zoomLevel));
    fetchDataFromAPI(dispatch, state, zoomLevel, boundingPolygon)
  }
}

export const appendRealTimeLimeData = (str) => {
  return (dispatch, getState) => {
    const newData = JSON.parse(str);
    const state = getState();
    const datasets = state['keplerGl']['map1']['visState']['datasets'];
    let oldData = [];
    if(LIME_DATA_ID in datasets && 'allData' in datasets[LIME_DATA_ID]){
      oldData = datasets[LIME_DATA_ID]['allData']
    }
    updateLimeMapData(dispatch, state, oldData.concat(convertLimeDataForMap(newData['rows'])));
  }
}

export const showFeatureMap = (mapId) => {
  return (dispatch, getState) => {
    const dataObject = MAP_ID_TO_GEO_JSON[mapId];
    const data = Processors.processGeojson(dataObject['geo']);
    dispatch(updateVisData({data: data, info: {id: mapId, label: dataObject['label']}}));
  }
}

export const hideFeatureMap = (mapId) => {
  return (dispatch, getState) => {
    const state = getState();
    const datasets = state['keplerGl']['map1']['visState']['datasets'];
    let newDataSets = [];
    let key = ""
    for(let key in datasets){
      if(key != mapId){
        let data = {
          "fields": datasets[key]['fields'],
          "rows": datasets[key]['allData']
        }
        let tempDataSet = {
          data,
          info: {
            id: key
          }
        }
        newDataSets.push(tempDataSet)
      }
    }
    const config = KeplerGlSchema.getConfigToSave(state['keplerGl']['map1']);
    dispatch(addDataToMap({datasets: newDataSets, config: config}));
  }
}

export const toggleGraphVisibility = () => {
  return (dispatch, getState) => {
    const state = getState();
    const graphVisibility = state['app']['graphVisibility'];
    if(graphVisibility == CSS_VISIBLE){
      dispatch(updateGraphVisibility(CSS_HIDDEN));
    }else{
      dispatch(updateGraphVisibility(CSS_VISIBLE));
    }
  }
}

const fetchDataFromAPI = (dispatch, state, zoomLevel, queryBoundingPolygon) => {
  dispatch(updateFetchInProgress(true));
  axios.post('http://' + BACKEND_URL + '/api/analyze/trip',
    {
      "start_time": state['app']['startDate'].unix(),
      "end_time": state['app']['endDate'].unix(),
      "limit": 100000,
      "boundingPolygon": state['app']['boundingPolygon'],
      "params": [
        {
          "field": "dur",
          "operator": "gte",
          "value": state['app']['tripDuration'][0]
        },
        {
          "field": "dur",
          "operator": "lte",
          "value": state['app']['tripDuration'][1]
        },
        {
          "field": "dist",
          "operator": "gte",
          "value": state['app']['tripDistance'][0]
        },
        {
          "field": "dist",
          "operator": "lte",
          "value": state['app']['tripDistance'][1]
        },
        {
          "field": "pts",
          "operator": "gte",
          "value": state['app']['tripStops'][0]
        },
        {
          "field": "pts",
          "operator": "lte",
          "value": state['app']['tripStops'][1]
        },
        {
          "field": "lat_s",
          "operator": "gte",
          "value": state['app']['srcLatitude'][0]
        },
        {
          "field": "lat_s",
          "operator": "lte",
          "value": state['app']['srcLatitude'][1]
        },
        {
          "field": "lng_s",
          "operator": "gte",
          "value": state['app']['srcLongitude'][0]
        },
        {
          "field": "lng_s",
          "operator": "lte",
          "value": state['app']['srcLongitude'][1]
        },
        {
          "field": "lat_d",
          "operator": "gte",
          "value": state['app']['destLatitude'][0]
        },
        {
          "field": "lat_d",
          "operator": "lte",
          "value": state['app']['destLatitude'][1]
        },
        {
          "field": "lng_d",
          "operator": "gte",
          "value": state['app']['destLongitude'][0]
        },
        {
          "field": "lng_d",
          "operator": "lte",
          "value": state['app']['destLongitude'][1]
        },
        {
          "field": "v_t",
          "operator": "eq",
          "value": state["app"]["vehicleTypes"]
        },
      ]
    }
  )
  .then(function(response){
    const newData = response['data']
    updateLimeMapData(dispatch, state, newData['rows']);
    dispatch(updateFetchInProgress(false));

  })
  .catch(function(error){
    dispatch(updateFetchInProgress(false));
  })
}

const updateLimeMapData = (dispatch, state, mapData) => {
  const datasets = state['keplerGl']['map1']['visState']['datasets'];
  let newDataSets = [];
  let key = ""
  for(let key in datasets){
    if(key != LIME_DATA_ID){
      let data = {
        "fields": datasets[key]['fields'],
        "rows": datasets[key]['allData']
      }
      let tempDataSet = {
        data,
        info: {
          id: key
        }
      }
      newDataSets.push(tempDataSet)
    }
  }
  let data = {
    "fields": mapFields,
    "rows": mapData
  }
  const limeDataSet = {
    data,
    info: {
      id: LIME_DATA_ID
    }
  }
  newDataSets.push(limeDataSet)
  const config = KeplerGlSchema.getConfigToSave(state['keplerGl']['map1']);
  dispatch(addDataToMap({datasets: newDataSets, config: config}));
}

const convertLimeDataForMap = (data) => {
  let newData = []
  data.forEach(record => {
    let tempRecord = [
      record['vehicle_id'],
      record['start_time_str'],
      record['end_time_str'],
      record['src']['latitude'],
      record['src']['longitude'],
      record['dest']['latitude'],
      record['dest']['longitude'],
      record['duration'],
      record['type'],
      record['start_time_h'],
      record['start_time_day_w'],
      record['start_time_day_m'],
      record['distance']
    ];
    newData.push(tempRecord);
  });
  return newData;
}

const updateMap = (dispatch, state, zoomLevel, queryBoundingPolygon) => {
  const mode = state.app.mode;
    if(mode == MODE_REAL_TIME){
    return
  }
  const zoomLevelDataMap = state.app.zoomLevelDataMap;
  if(zoomLevel in zoomLevelDataMap){
    const currBoundingPolygon = zoomLevelDataMap[zoomLevel]['bounds']
    if(withPolygon(queryBoundingPolygon, currBoundingPolygon)){
      updateLimeMapData(dispatch, state, zoomLevelDataMap[zoomLevel]['data'])
    }else{
      const missingPolygon = differencePolygons(queryBoundingPolygon, currBoundingPolygon);
      fetchDataFromAPI(dispatch, state, zoomLevel, missingPolygon)
    }
  }else{
    fetchDataFromAPI(dispatch, state, zoomLevel, queryBoundingPolygon)
  }
}

const updateMapWrapper = () => {
  return (dispatch, getState) => {
    const state = getState();
    if ('map1' in state.keplerGl){
      const mapState = state.keplerGl.map1.mapState;
      const bounds = geoViewport.bounds(
        [mapState.longitude, mapState.latitude], mapState.zoom,
        [mapState.width, mapState.height]
      );
      const zoomLevel = Math.round(mapState.zoom)
      const boundingPolygon = createBoundingBoxForScreen(bounds, zoomLevel);
      updateMap(dispatch, state, zoomLevel, boundingPolygon);
    }
  }
}

// ACTION CONSTANTS
export const UPDATE_START_DATE = "UPDATE_START_DATE";
export const UPDATE_END_DATE = "UPDATE_END_DATE"
export const UPDATE_TRIP_DURATION = "UPDATE_TRIP_DURATION"
export const UPDATE_TRIP_DISTANCE = "UPDATE_TRIP_DISTANCE"
export const UPDATE_TRIP_STOPS = "UPDATE_TRIP_STOPS"
export const UPDATE_SRC_LATITUDE = "UPDATE_SRC_LATITUDE"
export const UPDATE_SRC_LONGITUDE = "UPDATE_SRC_LONGITUDE"
export const UPDATE_DEST_LATITUDE = "UPDATE_DEST_LATITUDE"
export const UPDATE_DEST_LONGITUDE = "UPDATE_DEST_LONGITUDE"
export const UPDATE_VEHICLE_TYPES = "UPDATE_VEHICLE_TYPES"
export const UPDATE_SUSPECT_BIKES = "UPDATE_SUSPECT_BIKES"
export const UPDATE_MODE = "UPDATE_MODE"
export const UPDATE_FETCH_IN_PROGRESS = "UPDATE_FETCH_IN_PROGRESS"
export const UPDATE_GRAPH_VISIBILITY = "UPDATE_GRAPH_VISIBILITY"
export const UPDATE_BOUNDING_POLYGON = "UPDATE_BOUNDING_POLYGON"
export const UPDATE_ZOOM_LEVEL_DATA_MAP = "UPDATE_ZOOM_LEVEL_DATA_MAP"

// ACTIONS
export const updateStartDate = createAction(UPDATE_START_DATE);
export const updateEndDate = createAction(UPDATE_END_DATE);
export const updateTripDuration = createAction(UPDATE_TRIP_DURATION);
export const updateTripDistance = createAction(UPDATE_TRIP_DISTANCE);
export const updateTripStops = createAction(UPDATE_TRIP_STOPS);
export const updateSrcLatitude = createAction(UPDATE_SRC_LATITUDE);
export const updateSrcLongitude = createAction(UPDATE_SRC_LONGITUDE);
export const updateDestLatitude = createAction(UPDATE_DEST_LATITUDE);
export const updateDestLongitude = createAction(UPDATE_DEST_LONGITUDE);
export const updateVehiclType = createAction(UPDATE_VEHICLE_TYPES);
export const updateSuspectBikes = createAction(UPDATE_SUSPECT_BIKES);
export const updateMode = createAction(UPDATE_MODE);
export const updateFetchInProgress = createAction(UPDATE_FETCH_IN_PROGRESS);
export const updateGraphVisibility = createAction(UPDATE_GRAPH_VISIBILITY);
export const updateBoundingPolygon = createAction(UPDATE_BOUNDING_POLYGON);
export const updateZoomLevelDataMap = createAction(UPDATE_ZOOM_LEVEL_DATA_MAP);

// INITIAL_STATE
const initialState = {
  startDate: moment().subtract(7, "days"),
  endDate: moment(),
  maxTripDuration: 60 * 60 * 3,
  maxTripDistance: 10000,
  maxTripStops: 100,
  tripDuration: [0, 60 * 60 * 24 * 5],
  tripDistance: [0, 100000],
  tripStops: [0, 100],
  mapConfig: limeConfig,
  mapFields: mapFields,
  mode: MODE_HISTORICAL,
  suspectBikes: [],
  vehicleTypes: [VEHICLE_TYPE_BIKE, VEHICLE_TYPE_SCOOTER],
  fetchInProgress: false,
  graphVisibility: CSS_HIDDEN,
  boundingPolygon: {},
  zoomLevelDataMap: {},
  minLongitude: -77.112869,
  maxLongitude: -76.915683,
  minLatitude: 38.81348,
  maxLatitude: 38.995968,
  srcLatitude: [38.81348, 38.995968],
  srcLongitude: [-77.112869, -76.915683],
  destLatitude: [38.81348, 38.995968],
  destLongitude: [-77.112869, -76.915683]
};

// REDUCER
const appReducer = handleActions(
  {
    [UPDATE_START_DATE]: (state, action) => {
      return {
        ...state,
        startDate: action.payload
      }
    },
    [UPDATE_END_DATE]: (state, action) => {
      return {
        ...state,
        endDate: action.payload
      }
    },
    [UPDATE_TRIP_DURATION]: (state, action) => {
      return {
        ...state,
        tripDuration: action.payload
      }
    },
    [UPDATE_TRIP_DISTANCE]: (state, action) => {
      return {
        ...state,
        tripDistance: action.payload
      }
    },
    [UPDATE_SUSPECT_BIKES]: (state, action) => {
      return {
        ...state,
        suspectBikes: action.payload
      }
    },
    [UPDATE_VEHICLE_TYPES]: (state, action) => {
      return {
        ...state,
        vehicleTypes: action.payload
      }
    },
    [UPDATE_MODE]: (state, action) => {
      return {
        ...state,
        mode: action.payload
      }
    },
    [UPDATE_FETCH_IN_PROGRESS]: (state, action) => {
      return {
        ...state,
        fetchInProgress: action.payload
      }
    },
    [UPDATE_GRAPH_VISIBILITY]: (state, action) => {
      return {
        ...state,
        graphVisibility: action.payload
      }
    },
    [UPDATE_BOUNDING_POLYGON]: (state, action) => {
      return {
        ...state,
        boundingPolygon: action.payload
      }
    },
    [UPDATE_ZOOM_LEVEL_DATA_MAP]: (state, action) => {
      return {
        ...state,
        zoomLevelDataMap: action.payload
      }
    },
    [UPDATE_SRC_LONGITUDE]: (state, action) => {
      return {
        ...state,
        srcLongitude: action.payload
      }
    },
    [UPDATE_SRC_LATITUDE]: (state, action) => {
      return {
        ...state,
        srcLatitude: action.payload
      }
    },
    [UPDATE_DEST_LONGITUDE]: (state, action) => {
      return {
        ...state,
        destLongitude: action.payload
      }
    },
    [UPDATE_DEST_LATITUDE]: (state, action) => {
      return {
        ...state,
        destLatitude: action.payload
      }
    },
    ['@@kepler.gl/UPDATE_MAP']: (state, action) => {
      // action.asyncDispatch(updateMapWrapper())
      return {
        ...state
      }
    }
  },
  initialState
);

export default appReducer;
