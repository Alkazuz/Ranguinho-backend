"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RestaurantController_1 = __importDefault(require("../../controllers/RestaurantController"));
const routes = express_1.default.Router();
routes.post('/new', RestaurantController_1.default.create);
routes.get('/list', RestaurantController_1.default.list);
routes.get('/find/:id', RestaurantController_1.default.find);
exports.default = routes;
