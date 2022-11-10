
import geohash from "ngeohash";

export const getGeohashRange = (
    latitude: number,
    longitude: number,
    distance: number, // miles
  ) => {
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile
  
    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;
  
    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;
  
    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(upperLat, upperLon);
  
    return {
      lower,
      upper
    };
  };

export const calc_distance = (lat: number, long: number, lat_2: number, long_2: number) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    let lat1 = lat;
    let lon1 = long;
    
    let lat2 = lat_2;
    let lon2 = long_2;

    lon1 =  lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(lat1) * Math.cos(lat2)
             * Math.pow(Math.sin(dlon / 2),2);
           
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;

    return parseFloat((c * r).toFixed(1));
}