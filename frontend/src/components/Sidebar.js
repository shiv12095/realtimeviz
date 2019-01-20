import React, {Component} from 'react';
import {connect} from 'react-redux';
import { slide as Menu } from 'react-burger-menu'
import {
  updateStartDate, updateEndDate, updateTripDuration,
  updateTripDistance, updateTripStops, updateSrcLatitude, updateSrcLongitude,
  updateDestLatitude, updateDestLongitude
} from '../app-reducer';
import { Button, ButtonGroup } from 'reactstrap';
import moment from 'moment';

import '../css/sidebar.css';
import menuIcon from '../img/menu.svg'

import CustomDatePicker from './CustomDatePicker'
import SliderComponent from './SliderComponent'
import ToggleComponent from './ToggleComponent'
import MapPicker from './MapPicker'
import VehicleTypeSelector from './VehicleTypeSelector'

import DATE_TIME_FORMAT from '../utils/constants'

const containerStyle = {
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column'
}

class Sidebar extends Component {

  _onStartDateChange = (startDate) => {
    this.props.dispatch(
      updateStartDate(moment(startDate))
    );
  };

  _onEndDateChange = (endDate) => {
    this.props.dispatch(
      updateEndDate(moment(endDate))
    );
  };

  _onTripDurationChange = (tripDuration) => {
    this.props.dispatch(
      updateTripDuration(tripDuration)
    )
  }

  _onTripDistanceChange = (tripDistance) => {
    this.props.dispatch(
      updateTripDistance(tripDistance)
    )
  }

  _onTripStopsChange = (tripDistance) => {
    this.props.dispatch(
      updateTripStops(tripDistance)
    )
  }

  _onSrcLatitudeChange = (latitude) => {
    this.props.dispatch(
      updateSrcLatitude(latitude)
    )
  }

  _onSrcLongitudeChange = (longitude) => {
    this.props.dispatch(
      updateSrcLongitude(longitude)
    )
  }

  _onDestLatitudeChange = (latitude) => {
    this.props.dispatch(
      updateDestLatitude(latitude)
    )
  }

  _onDestLongitudeChange = (longitude) => {
    this.props.dispatch(
      updateDestLongitude(longitude)
    )
  }

  render() {
    return (
        <Menu
          isOpen={true}
          right
          customBurgerIcon={<img src={menuIcon}/>}
          customCrossIcon={false}
          width={400}
        >
        <div style={containerStyle}>
          <CustomDatePicker
            label={'Start Date'}
            initDateTime={this.props.startDate.toDate()}
            onChange={this._onStartDateChange}
          />
          <CustomDatePicker
            label={'End Date'}
            initDateTime={this.props.endDate.toDate()}
            onChange={this._onEndDateChange}
          />
        </div>
        <div style={containerStyle}>
          <SliderComponent
            onChange={this._onTripDurationChange}
            maxValue={this.props.maxTripDuration}
            minValue={0}
            initValue={this.props.tripDuration}
            step={1}
            label={"Trip Duration (s)"}
          />
          <SliderComponent
            onChange={this._onTripDistanceChange}
            maxValue={this.props.maxTripDistance}
            minValue={0}
            initValue={this.props.tripDistance}
            step={1}
            label={"Trip Distance (m)"}
          />
          <SliderComponent
            onChange={this._onSrcLatitudeChange}
            maxValue={this.props.maxLatitude}
            minValue={this.props.minLatitude}
            initValue={this.props.minLatitude}
            step={0.01}
            label={"Src Latitude"}
          />
          <SliderComponent
            onChange={this._onSrcLongitudeChange}
            maxValue={this.props.maxLongitude}
            minValue={this.props.minLongitude}
            initValue={this.props.minLongitude}
            step={0.01}
            label={"Src Longitude"}
          />
          <SliderComponent
            onChange={this._onDestLatitudeChange}
            maxValue={this.props.maxLatitude}
            minValue={this.props.minLatitude}
            initValue={this.props.minLatitude}
            step={0.01}
            label={"Dest Latitude"}
          />
          <SliderComponent
            onChange={this._onDestLongitudeChange}
            maxValue={this.props.maxLongitude}
            minValue={this.props.minLongitude}
            initValue={this.props.minLongitude}
            step={0.01}
            label={"Dest Longitude"}
          />
        </div>
        <div style={containerStyle}>
          <VehicleTypeSelector/>
        </div>
        <div style={containerStyle}>
          <ToggleComponent/>
        </div>
        <div style={containerStyle}>
          <MapPicker/>
        </div>
      </Menu>
    )
  }
}

const mapStateToProps = state => {
  return {
    startDate: state.app.startDate,
    endDate: state.app.endDate,
    tripDuration: state.app.tripDuration,
    tripDistance: state.app.tripDistance,
    tripStops: state.app.tripStops,
    maxTripDuration: state.app.maxTripDuration,
    maxTripDistance: state.app.maxTripDistance,
    maxTripStops: state.app.maxTripStops,
    minLatitude: state.app.minLatitude,
    maxLatitude: state.app.maxLatitude,
    minLongitude: state.app.minLongitude,
    maxLongitude: state.app.maxLongitude
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
