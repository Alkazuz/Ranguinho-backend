import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import { inflateSync } from 'zlib';
import Delivery from '../model/Delivery';
import Item from '../model/Product';
import Restaurant from '../model/Restaurant';

interface ItemDeliveryPrice{
    uid: string,
    count: number,
    description: string
}

export default {
    async create(request: Request, response: Response){

        //const appCheckToken = request.header('X-Firebase-AppCheck');

        //if (!appCheckToken) {
        //    return response.status(401).send('Unauthorized');
        //}

        const {uid, restaurant, items, lat, long} = request.body;

        try {
            //const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);

            let price_total = 0;

            for(let item of items){
                const item_model = await Item.findById(item.uid);
                price_total += item.count * item_model.price;
            }
            const delivery = await Delivery.create({userid: uid, restaurant: restaurant, price: price_total, lat, long, items}, uuidv4())
            
            const restaurant_model = await Restaurant.findById(delivery.restaurant)

            if(restaurant_model){
                await Restaurant.updateById(restaurant.id, {total_deliveries: restaurant.total_deliveries + 1})
            }

            return response.status(201).json(delivery);
        } catch (err) {
            return response.status(401).json({message: 'Unauthorized'});
        }
        
    },

    async update(request: Request, response: Response){
        const {id} = request.params;
        const { data } = request.body;

        const delivery = await Delivery.findById(id);

        if(!delivery) return response.status(404).json({message: 'Not found'});

        if(!delivery || delivery.userid != user) return response.status(401).json({message: 'Unauthorized'});

        if(delivery != -1) return response.status(401).json({message: 'Unauthorized'});

        const restaurant = await Restaurant.findById(delivery.restaurant)

        if(restaurant){
            let total_deliveries_rate = restaurant.total_deliveries_rate
            let total_rate = restaurant.total_rate

            total_deliveries_rate += 1;
            total_rate += data.rate;

            await Restaurant.updateById(restaurant.id, {total_deliveries_rate, total_rate});

        }

        await delivery.updateById(id, data)

        return response.status(200).json({message: 'Ok'});

    }

};

function uuidv4(): any {
    throw new Error('Function not implemented.');
}
