"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrderController_1 = __importDefault(require("../../../controllers/OrderController"));
const routes = express_1.default.Router();
routes.get('/find', OrderController_1.default.get);
exports.default = routes;
