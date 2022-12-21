"use strict";
/*
    Rota responsável por enviar categorias, melhores restaurantes e alguns banners
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StartController_1 = __importDefault(require("../../../controllers/StartController"));
const routes = express_1.default.Router();
routes.get('/:lat/:long', StartController_1.default.get);
exports.default = routes;
