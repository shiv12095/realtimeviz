import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import { Badge } from 'reactstrap';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

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
  marginBottom: '15px',
  marginTop: '15px',
  width: '350px',
  height: '30px'
}

const sliderStyle = {
  width: '215px',
  paddingTop: '1.1em'
}

class SliderComponent extends Component {

  componentDidMount() {
    let {
      initValue,
      maxValue,
      minValue,
      onChange,
      label,
      step
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
         <Range
           min={this.props.minValue}
           max={this.props.maxValue}
           defaultValue={[this.props.minValue, this.props.maxValue]}
           style={sliderStyle}
           onChange={this.props.onChange}
           step={this.props.step}
         />
       </div>
		)
	}
}

export default SliderComponent
