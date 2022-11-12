import express from "express";

import restaurantRoutes from './restaurant';
import startRoutes from './start'

const app = express();
const routes_v1 = express.Router();

routes_v1.use('/restaurant', restaurantRoutes);
routes_v1.use('/start', startRoutes)

export default routes_v1;