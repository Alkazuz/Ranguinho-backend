import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import { inflateSync } from 'zlib';
import Delivery from '../model/Delivery';
import Item from '../model/Itens';

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
            return response.status(201).json(delivery);
        } catch (err) {
            return response.status(401).json({message: 'Unauthorized'});
        }
        
    },

    async rate(request: Request, response: Response){
        const { uid, user, rate } = request.body;

        const delivery = await Delivery.findById(uid);

        if(!delivery || delivery.userid != user) return response.status(401).json({message: 'Unauthorized'});

        await delivery.updateById(uid, { rate })

        return response.status(200).json({message: 'Ok'});
    }

};

function uuidv4(): any {
    throw new Error('Function not implemented.');
}
