"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//firebase
const schema_1 = require("../schema");
const Rate_1 = __importDefault(require("../model/Rate"));
/**
 * Use o conteúdo da variável `Users` para desenvolver os métodos necessários
 */
exports.default = {
    async create(request, response) {
        const { user, restaurant, rate, description, id } = request.body;
        if (!(await schema_1.rateSchema.isValid({ user, restaurant, rate, description }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        const existing = await Rate_1.default.findById(id);
        if (!existing) {
            response
                .status(201)
                .json({ message: 'Esse pedido já foi avaliado' });
        }
        const rateModel = await Rate_1.default.create({ user, restaurant, rate, description });
        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            rateModel,
        });
    }
};
