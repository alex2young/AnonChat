import Geohash from "latlon-geohash";

const precision = 7;

export const get_geohash = function(lat, lon) {
  return Geohash.encode(lat, lon, precision);
};
