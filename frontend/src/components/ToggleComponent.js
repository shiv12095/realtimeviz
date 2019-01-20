import React, {Component} from 'react';
import Toggle from 'react-toggle'
import {ButtonGroup, Button, Badge} from 'reactstrap';
import {connect} from 'react-redux';
import LoaderButton from './LoaderButton';
import {
  fetchData, showSuspectBikes, updateMode, appendRealTimeLimeData,
  initMap, updateFetchInProgress
} from '../app-reducer';

import {MODE_HISTORICAL, MODE_REAL_TIME, BACKEND_URL} from '../utils/constants';

import '../css/toggle.css';

let websocket = null;

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

const bigButtonStyle = {
  width: '330px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px'
};

const smallButtonStyle = {
  width: '165px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '12px'
}

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: '150px'
}

class ToggleComponent extends Component {

  _fetchData = () => {
    this.props.dispatch(
      fetchData()
    );
  };

  _startLiveFeedSocket = () => {
    websocket = new WebSocket('ws:/'+ BACKEND_URL + '/feed/lime');
    websocket.onmessage = (point) => {
        const data = point['data']
        this.props.dispatch(
          appendRealTimeLimeData(data)
        );
    };
  }

  _showSuspectBikes = () => {
    this.props.dispatch(
      showSuspectBikes()
    );
  };

  _setToRealTimeMode = () => {
    this.props.dispatch(
      updateMode(MODE_REAL_TIME)
    )
    this.props.dispatch(
      initMap()
    )
    this._startLiveFeedSocket();
  }

  _setToHistoricalMode = () => {
    if(websocket != null){
      websocket.close()
      websocket = null
    }
    this.props.dispatch(
      updateMode(MODE_HISTORICAL)
    )
    this.props.dispatch(
      initMap()
    )
  }

  render(){
    let text = "Historical";
    if(this.props.mode == MODE_HISTORICAL){
      text = "Fetch Data";
    }
		return (
      <div style={topContainerStyle}>
        <div style={containerStyle}>
          <ButtonGroup>
            <Button
              color={this.props.mode == MODE_HISTORICAL ? "primary" : "secondary"}
              onClick={this._setToHistoricalMode}
              style={smallButtonStyle}
              active={this.props.mode == MODE_HISTORICAL}
            >
              Historical
            </Button>
            <Button
              color={this.props.mode == MODE_REAL_TIME ? "primary" : "secondary"}
              onClick={this._setToRealTimeMode}
              style={smallButtonStyle}
              active={this.props.mode == MODE_REAL_TIME}
              >
              Real Time
            </Button>
          </ButtonGroup>
        </div>
        <div style={containerStyle}>
          {this.props.mode == MODE_REAL_TIME ?
            <Button
              color="danger"
              onClick={this._showSuspectBikes}
              style={bigButtonStyle}
            >
              Highlight Anomlaies
            </Button>
            :
            <LoaderButton
              isLoading={this.props.fetchInProgress}
              buttonText={"Fetch Data"}
              buttonColor={"success"}
              buttonStyle={bigButtonStyle}
              onClick={this._fetchData}
              loaderColor={"#5cb85c"}
              loaderStyle={loaderStyle}
              loaderHeight={30}
              loaderWidth={30}
              loaderType={"Oval"}
            />
          }
        </div>
      </div>
	 )
  }
}

const mapStateToProps = state => {
  return {
    mode: state.app.mode,
    fetchInProgress: state.app.fetchInProgress
  }
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ToggleComponent);
