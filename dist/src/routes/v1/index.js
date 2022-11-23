"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_1 = __importDefault(require("./restaurant"));
const start_1 = __importDefault(require("./start"));
const app = (0, express_1.default)();
const routes_v1 = express_1.default.Router();
routes_v1.use('/restaurant', restaurant_1.default);
routes_v1.use('/start', start_1.default);
exports.default = routes_v1;
