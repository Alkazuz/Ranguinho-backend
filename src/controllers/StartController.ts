import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import { Query } from 'firefose';
import Banner from '../model/Banner';
import Category from '../model/Category';
import Restaurant from '../model/Restaurant';
import { startSchema } from '../schema';
import { getGeohashRange } from '../utils/geoutils';
import { unpopulate_date } from '../utils/schemautils';

export default {
    async get(request: Request, response: Response){

        let lat: string = request.params.lat as string;
        let long: string = request.params.long as string;

        if(!(await startSchema.isValid({
            lat,
            long
        }))){
            response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);

        let range = getGeohashRange(latitude, longitude, 10);

        let query = new Query()
        .where("geohash", ">=", range.lower)
        .where("geohash", "<=", range.upper)
        //.orderBy('total_rate', 'asc')
        .limit(10)

        const restaurants = await Restaurant.find(query)

        for(const restaurant of restaurants){ 
            unpopulate_date(restaurant)
        }

        const categories = await Category.find(new Query().orderBy('position', 'asc'));

        range = getGeohashRange(latitude, longitude, 25);

        query = new Query()
        .where("loc", ">=", range.lower)
        .where("loc", "<=", range.upper)

        const banners = await Banner.find(query);

        return response.json({restaurants, categories, banners}).status(200)

    }
};