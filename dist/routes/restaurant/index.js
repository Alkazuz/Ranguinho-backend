"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const RateController_1 = __importDefault(require("../../controllers/RateController"));
const RestaurantController_1 = __importDefault(require("../../controllers/RestaurantController"));
const routes = express_1.default.Router();
routes.post('/list', RestaurantController_1.default.list);
routes.post('/new', RestaurantController_1.default.create);
routes.post('/rate', RateController_1.default.create);
exports.default = routes;
