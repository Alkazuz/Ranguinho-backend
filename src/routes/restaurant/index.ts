import express from 'express';
import RateController from '../../controllers/RateController';
import RestaurantController from '../../controllers/RestaurantController';
const routes = express.Router();

routes.post('/list', RestaurantController.list);
routes.post('/new',  RestaurantController.create);
routes.post('/rate', RateController.create);

export default routes;