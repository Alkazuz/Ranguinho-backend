import { Request, Response } from 'express';
//firebase
import { Query } from 'firefose';
import Restaurant from '../model/Restaurant';

import geohash from "ngeohash";
import { restaurantSchema } from '../schema';


export default {
    async list(request: Request, response: Response){

        const {lat, log} = request.body;
        const range = getGeohashRange(lat, log, 30);

        const query = new Query()
        .where("geohash", ">=", range.lower)
        .where("geohash", "<=", range.upper)
        
        const data = await Restaurant.find(query);
        return response.json(data).status(200);
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
            long, geohash: geoh});
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
