import express from 'express';
import RestaurantController from '../../controllers/RestaurantController';

const routes = express.Router();
routes.post('/new',  RestaurantController.create);
routes.get('/list', RestaurantController.list);
routes.get('/find/:id', RestaurantController.find);

export default routes;