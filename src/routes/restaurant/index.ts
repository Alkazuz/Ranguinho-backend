import express from 'express';
import RestaurantController from '../../controllers/RestaurantController';

const routes = express.Router();
routes.post('/new',  RestaurantController.create);
routes.post('/list',  RestaurantController.list);

export default routes;