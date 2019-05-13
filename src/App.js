import React, { Component } from "react";
import { css } from "glamor";

import Router from "./Router";
import { GeoContext, getGeohash } from "./geo";

class App extends Component {
  state = {
    coords: {},
    geohash: "",
    watch_id: 1
  };

  watchLocation = () => {
    // Get the current position of the user
    console.log("start watch on App");
    let watch_id = navigator.geolocation.watchPosition(
      position => {
        this.setState(prevState => ({
          coords: position.coords,
          geohash: getGeohash(position.coords)
        }));
        //   console.log(this.props);
        console.log("fetched gps from App");
        // this.props.refetch({ geohash: this.state.geohash });
      },
      error => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 }
    );
    this.setState({ watch_id });
  };

  componentWillMount() {
    this.watchLocation();
  }

  componentWillUnmount() {
    console.log("unmount App");
    navigator.geolocation.clearWatch(this.state.watch_id);
  }
  render() {
    return (
      <div {...css(styles.container)}>
        <GeoContext.Provider value={this.state}>
          <Router />
        </GeoContext.Provider>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: "55px 0px 50px"
  }
};

export default App;
