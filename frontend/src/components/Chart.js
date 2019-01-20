import React, {Component} from 'react';
import {connect} from 'react-redux';
import crossfilter from 'crossfilter'
import {Bar} from 'react-chartjs-2';

const chartStyleHourOfDay = {
  width: '250px',
  height: '150px',
  zIndex: 2,
  position: 'absolute',
  top: '40px',
  right: '600px'
};

const chartStyleDayOfMonth = {
  width: '250px',
  height: '150px',
  zIndex: 2,
  position: 'absolute',
  top: '40px',
  right: '50px'
};

const chartStyleDayOfWeek = {
  width: '250px',
  height: '150px',
  zIndex: 2,
  position: 'absolute',
  top: '40px',
  right: '325px'
};

const options = {
  responsive: true,
  tooltips: {
    mode: 'label'
  },
  elements: {
    line: {
      fill: false,
      lineTension: 0
    }
  },
  scales: {
    xAxes: [
      {
        display: false,
        gridLines: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: true
        }
      }
    ]
  },
  legend: {
    display: true,
    position: 'bottom',
    fullWidth: true,
    reverse: false,
  },
  maintainAspectRatio: false
};

const getChartData = (data, maxValue, chartLabel) => {
  let dataMap = {}
  data.forEach(record => {
    let key = record['key']
    let value = record['value']
    dataMap[key] = value
  });
  let labels = [];
  let newData = [];
  for(let i = 0 ; i <= maxValue ; i++){
    labels.push(i);
    if(i in dataMap){
      newData.push(dataMap[i]);
    }else{
      newData.push(0);
    }
  }
  return {
    labels: labels,
    datasets: [
      {
        label: chartLabel,
        backgroundColor: 'rgba(0,123,355,0.2)',
        borderColor: 'rgba(0,123,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0,123,255,0.6)',
        hoverBorderColor: 'rgba(0,123,255,1)',
        data: newData
      }
    ]
  };
}

class Chart extends Component {

  render() {
    const crossFilterData = crossfilter(this.props.crossFilterData);
    const hourOfDayDimension = crossFilterData.dimension(record => {return record[9]});
    const dayOfWeekDimension = crossFilterData.dimension(record => {return record[10]});
    const dayOfMonthDimension = crossFilterData.dimension(record => {return record[11]});
    const hourOfDayChartData = getChartData(hourOfDayDimension.group().all(), 24, "Hour of Day");
    const dayOfWeekChartData = getChartData(dayOfWeekDimension.group().all(), 7, "Day of Week");
    const dayOfMonthChartData = getChartData(dayOfMonthDimension.group().all(), 31, "Day of Month");
    return (
      <div style={{
        visibility: this.props.graphVisibility

      }}>
        <div style={chartStyleHourOfDay}>
          <Bar
            data={hourOfDayChartData}
            width={100}
            height={100}
            options={options}
          />
        </div>
        <div style={chartStyleDayOfWeek}>
          <Bar
            data={dayOfWeekChartData}
            width={100}
            height={100}
            options={options}
          />
        </div>
        <div style={chartStyleDayOfMonth}>
          <Bar
            data={dayOfMonthChartData}
            width={100}
            height={100}
            options={options}
            onElementsClick={(event) => {console.log(event)}}
          />
        </div>
    </div>
    );
  }
}

const normaliseData = (maxValue, data) => {
  let newData = {}
  for(let i = 0 ; i < maxValue ; i++){
    newData[i] = 0;
  }
  data.forEach(record => {
    let key = record['key'];
    let value = record['value'];
    newData[key] = value;
  });
  let finalData = [];
  let key = "";
  for(key in newData){
    finalData.push({'x': key, 'y': newData[key]});
  }
  return finalData;
}

const convertDataForGraph = (data) => {
  let newData = []
  data.forEach(record => {
    let key = record['key'];
    let value = record['value'];
    newData.push({'x': key, 'y': value});
  });
  return newData;
}

const getCrossFilterData = state => {
  if('map1' in state['keplerGl'] &&
     'visState' in state['keplerGl']['map1'] &&
     'datasets' in state['keplerGl']['map1']['visState']  &&
     'lime_trip' in state['keplerGl']['map1']['visState']['datasets'] &&
     'data' in state['keplerGl']['map1']['visState']['datasets']['lime_trip']){
    return state.keplerGl.map1.visState.datasets.lime_trip.data;
  }else{
    return [];
  }
}

const mapStateToProps = state => {
  return {
    crossFilterData: getCrossFilterData(state),
    graphVisibility: state.app.graphVisibility,
  };
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
