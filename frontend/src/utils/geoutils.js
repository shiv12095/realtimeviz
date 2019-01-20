import {polygon, difference, union, booleanWithin} from '@turf/turf'

import {ZOOM_LEVEL_LAT_LONG_MAP} from './constants'

export const createBoundingBoxForScreen = (boundingBox, zoomLevel) => {
  if(ZOOM_LEVEL_LAT_LONG_MAP[zoomLevel] != null){
    let zoomLevelMap = ZOOM_LEVEL_LAT_LONG_MAP[zoomLevel]
    return createPolygon([
      boundingBox[0] - zoomLevelMap['lon'][0],
      boundingBox[1] - zoomLevelMap['lat'][0],
      boundingBox[2] + zoomLevelMap['lon'][1],
      boundingBox[3] + zoomLevelMap['lat'][1],
    ])
  }else{
    createPolygon(boundingBox)
  }
}

export const createPolygon = (boundingBox) => {
  const longMin = boundingBox[0]
  const latMin = boundingBox[1]
  const longMax = boundingBox[2]
  const latMax = boundingBox[3]
  const boundingPolygon = polygon(
    [[[longMin, latMin], [longMin, latMax], [longMax, latMax], [longMax, latMin], [longMin, latMin]]],
    {bbox: boundingBox}
  );
  return boundingPolygon
}

export const differencePolygons = (polygon1, polygon2) => {
  return difference(polygon1, polygon2)
}

export const combinePolygons = (polygon1, polygon2) => {
  return union(polygon1, polygon2)
}

export const withPolygon = (insidePolygon, enclosingPolygon) => {
  return booleanWithin(insidePolygon, enclosingPolygon)
}
