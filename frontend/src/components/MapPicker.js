import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, ButtonGroup, Badge} from 'reactstrap';
import {showFeatureMap, hideFeatureMap} from '../app-reducer';
import {
  MAP_HOSPITAL_AREA, MAP_PUBLIC_SCHOOL, MAP_NEIGHBOURHOOD_CLUSTERS,
  MAP_CIRCULATOR_STOPS ,MAP_UNIVERSITIES_AND_COLLEGES, MAP_POLICE_SECTORS,
  MAP_MUSEUMS, MAP_PARKS_AND_REC, MAP_METRO_STATIONS
} from '../utils/constants';

const topContainerStyle = {
  display: 'flex',
  flexDirection: 'column'
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '5px',
  marginTop: '5px',
  width: '350px',
  height: '30px'
}

const buttonStyle = {
  marginRight: '5px',
  marginLeft: '5px',
  width: 'auto',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px'
}

const badgeStyle = {
  width: 'auto',
  height: '30px',
  marginRight: '5px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '10px'
};

class MapPicker extends Component {
  constructor (props) {
    super(props);
    this.state = {activeMaps: []};
  }

  _active = (mapId) => {
    const index = this.state.activeMaps.indexOf(mapId);
    if(index > -1){
      return true;
    }else{
      return false;
    }
  }

  _onClick = (mapId) => {
    const index = this.state.activeMaps.indexOf(mapId);
    if(index > -1){
      this.state.activeMaps.splice(index, 1);
      this.props.dispatch(hideFeatureMap(mapId));
    }else{
      this.state.activeMaps.push(mapId);
      this.props.dispatch(showFeatureMap(mapId));
    }
    this.setState({activeMaps: [...this.state.activeMaps]});
  }

  render() {
    return (
      <div style={topContainerStyle}>
        <div style={containerStyle}>
          <Badge
            pill
            style={badgeStyle}
            color="light"
          >
            Also Show
          </Badge>
          <Button
            style={buttonStyle}
            color={this._active(MAP_HOSPITAL_AREA) ? "primary" : "secondary"}
            onClick={() => {this._onClick(MAP_HOSPITAL_AREA)}}
            active={this.state.activeMaps.includes(MAP_HOSPITAL_AREA)}>
            Hospital Areas
          </Button>
          <Button
            style={buttonStyle}
            color={this._active(MAP_PUBLIC_SCHOOL) ? "primary" : "secondary"}
            onClick={() => {this._onClick(MAP_PUBLIC_SCHOOL)}}
            active={this.state.activeMaps.includes(MAP_PUBLIC_SCHOOL)}>
            Public Schools
          </Button>
        </div>
        <div style={containerStyle}>
          <Button
            style={buttonStyle}
            color={this._active(MAP_CIRCULATOR_STOPS) ? "primary" : "secondary"}
            onClick={() => {this._onClick(MAP_CIRCULATOR_STOPS)}}
            active={this.state.activeMaps.includes(MAP_CIRCULATOR_STOPS)}>
            DC Circulator Stops
          </Button>
          <Button
            style={buttonStyle}
            color={this._active(MAP_UNIVERSITIES_AND_COLLEGES) ? "primary" : "secondary"}
            onClick={() => {this._onClick(MAP_UNIVERSITIES_AND_COLLEGES)}}
            active={this.state.activeMaps.includes(MAP_UNIVERSITIES_AND_COLLEGES)}>
            Universities and Colleges
          </Button>
      </div>
      <div style={containerStyle}>
        <Button
          style={buttonStyle}
          color={this._active(MAP_METRO_STATIONS) ? "primary" : "secondary"}
          onClick={() => {this._onClick(MAP_METRO_STATIONS)}}
          active={this.state.activeMaps.includes(MAP_METRO_STATIONS)}>
          Metro Stations
        </Button>
        <Button
          style={buttonStyle}
          color={this._active(MAP_NEIGHBOURHOOD_CLUSTERS) ? "primary" : "secondary"}
          onClick={() => {this._onClick(MAP_NEIGHBOURHOOD_CLUSTERS)}}
          active={this.state.activeMaps.includes(MAP_NEIGHBOURHOOD_CLUSTERS)}>
          Neighbourhood Clusters
        </Button>
      </div>
      <div style={containerStyle}>
        <Button
          style={buttonStyle}
          color={this._active(MAP_PARKS_AND_REC) ? "primary" : "secondary"}
          onClick={() => {this._onClick(MAP_PARKS_AND_REC)}}
          active={this.state.activeMaps.includes(MAP_PARKS_AND_REC)}>
          Parks and Recreation
        </Button>
        <Button
          style={buttonStyle}
          color={this._active(MAP_MUSEUMS) ? "primary" : "secondary"}
          onClick={() => {this._onClick(MAP_MUSEUMS)}}
          active={this.state.activeMaps.includes(MAP_MUSEUMS)}>
          Museums
        </Button>
      </div>
    </div>
    )
  }
}

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(MapPicker);
