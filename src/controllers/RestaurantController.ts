import { Request, Response } from 'express';
//firebase
import { Query } from 'firefose';
import { Timestamp } from "firebase/firestore";

import Restaurant from '../model/Restaurant';

import { v4 as uuidv4 } from 'uuid';

import geohash from "ngeohash";
import { restaurantSchema } from '../schema';
import { geocoder } from '..';
import Address from '../model/Address';
import { process_restaurant_ful } from '../utils/schemautils';
import { getGeohashRange } from '../utils/geoutils';

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

    async update(request: Request, response: Response){
        const id: string = request.params.id as string;
        const dataBody = request.body.data as string;

        const data = JSON.parse(JSON.stringify(dataBody));

        let restaurant = await Restaurant.findById(id);

        if(!restaurant) return response.send("Not found").status(404);

        restaurant = await Restaurant.updateById(id, data);

        if(restaurant) return response.json(restaurant).status(200);

        return response.send("Erro").status(202)
    },

    async find(request: Request, response: Response){
        const lat:number = parseFloat(request.query.lat as string)
        const lng:number = parseFloat(request.query.lng as string)
        const id:string  = request.params.id as string;

        const restaurant = await Restaurant.findById(id);

        if(!restaurant) return response.send("Not found").status(404);
        
        process_restaurant_ful(restaurant, lat, lng)
        
        return response.send(restaurant);

    },

    async create(request: Request, response: Response){

        const { name, category, delivery_price, lat, long, logo, bannerURL } = request.body;

        if (!(await restaurantSchema.isValid({name,
            logo,
            delivery_price,
            category,
            bannerURL,
            lat,
            long}))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }

        const geoh = geohash.encode(lat, long);
        const geodata = JSON.parse(JSON.stringify(await geocoder.reverse({ lat: lat, lon: long })))[0];
        const address = await Address.create({state: geodata.administrativeLevels.level1short, city: geodata.administrativeLevels.level2short, neighborhood : geodata.extra.neighborhood})

        const restaurant = await Restaurant.create({ 
            name,
            logo,
            delivery_price,
            bannerURL,
            category,
            lat,
            long,
            address_info: address,
            geohash: geoh
        }, uuidv4());

        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            restaurant,
        });
        
    }

};