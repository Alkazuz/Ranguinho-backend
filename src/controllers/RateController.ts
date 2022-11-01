import { Request, Response } from 'express';

//firebase
import { rateSchema } from '../schema';
import Rate from '../model/Rate';


export default {
    async create(request: Request, response: Response){

        const { user, restaurant, rate, description, id } = request.body;

        if (!(await rateSchema.isValid({ user, restaurant, rate, description }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }

        const existing = await Rate.findById(id);
        if (!existing) {
            response
            .status(201)
            .json({ message: 'Esse pedido já foi avaliado' });
        }

        const rateModel = await Rate.create({user, restaurant, rate, description})

        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            rateModel,
        });
        
    }

};