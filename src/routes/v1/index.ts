import express from "express";

import restaurantRoutes from './restaurant';

const app = express();
const routes_v1 = express.Router();

routes_v1.use('/restaurant', restaurantRoutes);

export default routes_v1;