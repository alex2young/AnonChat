import Geohash from "latlon-geohash";
import React from "react";

const precision = 7;
export const getGeohash = function({ latitude, longitude }) {
  return Geohash.encode(latitude, longitude, precision);
};

export const GeoContext = React.createContext({
  coords: { latitude: null, longitude: null },
  geohash: null
});
