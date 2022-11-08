import { Request, Response } from 'express';
//firebase
import { Query } from 'firefose';
import Restaurant from '../model/Restaurant';

import { v4 as uuidv4 } from 'uuid';

import geohash from "ngeohash";
import { restaurantSchema } from '../schema';

const calc_distance = (lat: number, long: number, lat_2: number, long_2: number) => {
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

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
             + Math.cos(lat1) * Math.cos(lat2)
             * Math.pow(Math.sin(dlon / 2),2);
           
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return parseFloat((c * r).toFixed(1));
}

const calc_delivery = (distance: number, fee: number) => {
    let price = distance * fee;
    if(price == 0) return 0;
    if(price < fee) price = fee;
    
    return price;
}

const process_restaurant_ful = (restaurant: typeof Restaurant, lat: number, lng: number) => {
    restaurant.distance = calc_distance(restaurant.lat, restaurant.long, lat, lng);
    restaurant.fee = calc_delivery(restaurant.distance, restaurant.delivery_price);
}

export default {
    async list(request: Request, response: Response){

        const lat:number = parseFloat(request.query.lat as string)
        const lng:number = parseFloat(request.query.lng as string)
        const page:number = parseInt(request.query.page as string)

        const range = getGeohashRange(lat, lng, 30);

        const query = new Query()
        .where("geohash", ">=", range.lower)
        .where("geohash", "<=", range.upper)
        .offset(page * 10).limit(10)
        
        const data = await Restaurant.find(query);

        for(const restaurant of data){
            
            process_restaurant_ful(restaurant, lat, lng)
        }

        return response.json(data).status(200);
    },

    async find(request: Request, response: Response){
        const lat:number = parseFloat(request.query.lat as string)
        const lng:number = parseFloat(request.query.lng as string)
        const id:string  = request.params.id as string;

        console.log(lat, lng, id)

        const restaurant = await Restaurant.findById(id);

        if(!restaurant) return response.send("Not found").status(404);
        
        process_restaurant_ful(restaurant, lat, lng)
        
        return response.send(restaurant);

    },

    async create(request: Request, response: Response){

        const { name, category, delivery_price, lat, long, logo } = request.body;

        if (!(await restaurantSchema.isValid({name,
            logo,
            delivery_price,
            category,
            lat,
            long}))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }

        const geoh = geohash.encode(lat, long);
        const restaurant = await Restaurant.create({ 
            name,
            logo,
            delivery_price,
            category,
            lat,
            long, geohash: geoh}, uuidv4());
        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            restaurant,
        });
        
    }

};

const getGeohashRange = (
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
