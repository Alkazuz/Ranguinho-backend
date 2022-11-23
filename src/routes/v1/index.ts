import express from "express";

import restaurantRoutes from './restaurant';
import startRoutes from './start'
import orderRoutes from './orders'
import deliveryRoutes from './delivery'

const app = express();
const routes_v1 = express.Router();

routes_v1.use('/restaurant', restaurantRoutes);
routes_v1.use('/start', startRoutes)
routes_v1.use('/delivery', deliveryRoutes)
routes_v1.use('/orders', orderRoutes)

export default routes_v1;