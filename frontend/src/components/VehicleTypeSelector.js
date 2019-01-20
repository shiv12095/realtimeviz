import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, ButtonGroup, Badge} from 'reactstrap';
import {updateVehiclType} from '../app-reducer';
import {VEHICLE_TYPE_BIKE, VEHICLE_TYPE_SCOOTER} from '../utils/constants';

const badgeStyle = {
  width: '100px',
  height: '30px',
  marginRight: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '10px'
};

const topContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
  marginTop: '10px',
  width: '350px',
  height: '30px'
}

const buttonStyle = {
  marginRight: '5px',
  width: '110px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px'
}

class VehicleTypeSelector extends Component {
  constructor (props) {
    super(props);
    this.state = {vehicleTypes: [VEHICLE_TYPE_BIKE, VEHICLE_TYPE_SCOOTER]};
  }

  _active = (type) => {
    const index = this.state.vehicleTypes.indexOf(type);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  _onClick = (type) => {
    const index = this.state.vehicleTypes.indexOf(type);
    if(index > -1){
      this.state.vehicleTypes.splice(index, 1);
    }else{
      this.state.vehicleTypes.push(type);
    }
    this.setState({vehicleTypes: [...this.state.vehicleTypes]});
    this.props.dispatch(
      updateVehiclType(this.state.vehicleTypes)
    )
  }

  render() {
    return (
      <div style={containerStyle}>
        <Badge
          pill
          style={badgeStyle}
          color="light"
        >
          {"Vehicle Type"}
        </Badge>
        <Button
          style={buttonStyle}
          color={this._active(VEHICLE_TYPE_BIKE) ? "primary" : "secondary"}
          onClick={() => {this._onClick(VEHICLE_TYPE_BIKE)}}
          active={this.state.vehicleTypes.includes(VEHICLE_TYPE_BIKE)}>
          Bike
        </Button>
        <Button
          style={buttonStyle}
          color={this._active(VEHICLE_TYPE_SCOOTER) ? "primary" : "secondary"}
          onClick={() => {this._onClick(VEHICLE_TYPE_SCOOTER)}}
          active={this.state.vehicleTypes.includes(VEHICLE_TYPE_SCOOTER)}>
          Scooter
        </Button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleTypeSelector);
