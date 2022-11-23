"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DeliveryController_1 = __importDefault(require("../../../controllers/DeliveryController"));
const routes = express_1.default.Router();
routes.post('/new', DeliveryController_1.default.create);
exports.default = routes;
