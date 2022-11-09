import express from 'express';
import DeliveryController from '../../../controllers/DeliveryController';
const routes = express.Router();

routes.post('/new',   DeliveryController.create);
routes.patch('/rate/:id',  DeliveryController.rate);


export default routes;