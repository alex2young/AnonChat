import Geohash from "latlon-geohash";

const precision = 7;
export const getGeohash = function({ latitude, longitude }) {
  return Geohash.encode(latitude, longitude, precision);
};
