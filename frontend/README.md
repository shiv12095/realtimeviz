# Frontend

#### Introduction
The frontend extensively uses [kepler.gl](http://kepler.gl/#/). More specifically, this has been built by extending [custom-reducer example](https://github.com/uber/kepler.gl/tree/master/examples/custom-reducer)

The frontend is the analytics dashboard that can be used to analyze the Limebike trip data. While Kepler.gl is primarily built as an in browser application without a backend support, appropriate changes have been made to:

- Dynamically load data from the backend
- Show a real time feed for the data  

#### Set Up

##### Config Setup

Set the `MAPBOX_TOKEN` and `BACKEND_URL` in `utils/constants.js`

##### Install dependencies

Run `npm install`

##### Start the server

Run `npm start`
