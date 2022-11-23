import express from 'express';
import OrderController from '../../../controllers/OrderController';

const routes = express.Router();

routes.get('/find',  OrderController.get);

export default routes;