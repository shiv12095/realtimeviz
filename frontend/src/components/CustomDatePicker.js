import React, {Component} from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets-moment';
import Moment from 'moment';
import {Badge} from 'reactstrap';
import DATE_TIME_FORMAT from '../utils/constants'

import 'react-widgets/dist/css/react-widgets.css';

Moment.locale('en');
momentLocalizer();

const badgeStyle = {
  width: '100px',
  height: '30px',
  marginRight: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '10px'
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '10px',
  marginTop: '10px',
  width: '350px',
  height: '30px'
}

const datePickerStyle = {
  width: 'auto',
  fontSize: '0.7em'
}

class CustomDatePicker extends Component {
  componentDidMount() {
    let {
      initDateTime,
      onChange,
      label
    } = this.props
  }

	render(){
		return (
      <div style={containerStyle}>
        <Badge
          pill
          style={badgeStyle}
          color="light"
        >
          {this.props.label}
        </Badge>
        <DateTimePicker
          style={datePickerStyle}
          defaultValue={this.props.initDateTime}
          onChange={this.props.onChange}
          parse={[DATE_TIME_FORMAT]}
        />
      </div>
		)
	}
}

export default CustomDatePicker
