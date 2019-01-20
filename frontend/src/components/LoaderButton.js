import React, {Component} from 'react';
import Toggle from 'react-toggle'
import {Button} from 'reactstrap';
import Loader from 'react-loader-spinner';

class LoaderButton extends Component {

  componentDidMount() {
    let {
      isLoading,
      buttonColor,
      buttonStyle,
      buttonText,
      onClick,
      loaderColor,
      loaderStyle,
      loaderHeight,
      loaderWidth,
      loaderType
    } = this.props
  }

  render(){
    return (
      <div>
        {this.props.isLoading ?
          <div style={this.props.loaderStyle}>
            <Loader
              type={this.props.loaderType}
              color={this.props.loaderColor}
              height={this.props.loaderHeight}
              width={this.props.loaderWidth}
            />
          </div>
          :
          <Button
            color={this.props.buttonColor}
            onClick={this.props.onClick}
            style={this.props.buttonStyle}
          >
            {this.props.buttonText}
          </Button>
        }
      </div>
    )
  }
}

export default LoaderButton
