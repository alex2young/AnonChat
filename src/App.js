import React, { Component } from "react";
import { css } from "glamor";

import Router from "./Router";
import { GeoContext, getGeohash } from "./geo";

class App extends Component {
  toggleOverlay = visible => {
    this.setState({ showOverlay: visible });
  };
  state = {
    coords: {},
    geohash: "dr72j",
    watch_id: 1,
    showOverlay: false,
    toggleOverlay: this.toggleOverlay
  };

  watchLocation = () => {
    // Get the current position of the user
    console.log("start watch on App");
    let watch_id = navigator.geolocation.watchPosition(
      position => {
        let newGeoHash = getGeohash(position.coords);
        this.setState(prevState => ({
          coords: position.coords,
          geohash: newGeoHash
        }));
        //   console.log(this.props);
        console.log("fetched new gps from App, new geohash = " + newGeoHash);
        // this.props.refetch({ geohash: this.state.geohash });
      },
      error => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 2000 }
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
