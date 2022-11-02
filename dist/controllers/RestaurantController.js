"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//firebase
const firefose_1 = require("firefose");
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const ngeohash_1 = __importDefault(require("ngeohash"));
const schema_1 = require("../schema");
exports.default = {
    async list(request, response) {
        const { lat, log } = request.body;
        const range = getGeohashRange(lat, log, 30);
        const query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper);
        const data = await Restaurant_1.default.find(query);
        return response.json(data).status(200);
    },
    async create(request, response) {
        const { name, category, preco, delivery_price, lat, long, logo } = request.body;
        if (!(await schema_1.restaurantSchema.isValid({ name, category, preco, delivery_price, lat, long, logo }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        const geohash = getGeohashRange(lat, long, 30);
        const restaurant = await Restaurant_1.default.create({ name, geohash, category, preco, delivery_price, lat, long, logo });
        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            restaurant,
        });
    }
};
const getGeohashRange = (latitude, longitude, distance) => {
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile
    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;
    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;
    const lower = ngeohash_1.default.encode(lowerLat, lowerLon);
    const upper = ngeohash_1.default.encode(upperLat, upperLon);
    return {
        lower,
        upper
    };
};
