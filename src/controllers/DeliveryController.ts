import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import geohash from "ngeohash";
import Address from '../model/Address';
import Delivery from '../model/Delivery';
import DeliveryStatus from '../model/DeliveryStatus';
import Product from '../model/Product';
import { v4 as uuidv4 } from 'uuid';
import Restaurant from '../model/Restaurant';
import { deliverySchema } from '../schema';
import { geocoder } from '../utils/geoutils';


export default {
    async create(request: Request, response: Response){

        //const appCheckToken = request.header('X-Firebase-AppCheck');

        //if (!appCheckToken) {
        //    return response.status(401).send('Unauthorized');
        //}

        const {userid, restaurant, items, lat, long} = request.body;

        if(!(await deliverySchema.isValid({
            lat,
            long,
            items,
            restaurant,
            userid
        }))){
            response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }

        try {
            //const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
            
            const restaurant_model = await Restaurant.findById(restaurant);

            if(!restaurant_model) return response.status(401).json({message: 'Restaurante não existe'})

            const geoh = geohash.encode(lat, long);

            const geodata = JSON.parse(JSON.stringify(await geocoder.reverse({ lat: lat, lon: long })))[0];
            const address = await Address.create({
                state: geodata.administrativeLevels.level1short, 
                city: geodata.administrativeLevels.level2short, 
                neighborhood : geodata.extra.neighborhood,
                entity: 'delivery',
                geohash: geoh,
                lat: lat,
                long: long,
            }, uuidv4())

            let price = 0;

            items.forEach( async (item) => {
                const product = await Product.findById(item.id);
                if(!product) return response.status(401).json({message: 'Produto colocado não existe'});
                price += product.price * item.count;
            })

            const delivery_status = await DeliveryStatus.findById('lwJNSjMmyBnNhtCU5OSN');

            const uuid = uuidv4();
            let delivery = await Delivery.create({
                userid: userid,
                restaurant: restaurant_model.id,
                address: address.id,
                price: price,
                uid: uuid,
                items: items,
                delivery_status: delivery_status.id
            }, uuid)

            return response.status(201).json(delivery);
        } catch (err) {
            return response.status(401).json({message: err.message});
        }
        
    }

};