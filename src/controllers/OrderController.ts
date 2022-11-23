import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import { Query } from 'firefose';
import Delivery from '../model/Delivery';

export default {
    async get(request: Request, response: Response){
        if (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            return response.status(403).json({ error: 'No credentials sent!' });
        }

        const authToken = request.headers.authorization.split(' ')[1];

        try{
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            
            const userid = userInfo.uid;

            const deliveries = await Delivery.find(new Query().where('userid', '==', userid).populate('address').populate('delivery_status'))
            
            return response.status(200).json(deliveries)
        }catch (e) {
            return response
            .status(401)
            .send({ error: 'You are not authorized to make this request' });
        }
    }
};