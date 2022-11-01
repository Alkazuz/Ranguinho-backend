import express from 'express';
import DeliveryController from '../../controllers/DeliveryController';
const routes = express.Router();

routes.post('/new',  DeliveryController.create);
routes.post('/rate',  DeliveryController.rate);


export default routes;