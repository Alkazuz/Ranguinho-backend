"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//firebase
const firefose_1 = require("firefose");
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const uuid_1 = require("uuid");
const ngeohash_1 = __importDefault(require("ngeohash"));
const schema_1 = require("../schema");
const calc_distance = (lat, long, lat_2, long_2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    let lat1 = lat;
    let lon1 = long;
    let lat2 = lat_2;
    let lon2 = long_2;
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;
    // calculate the result
    return parseFloat((c * r).toFixed(1));
};
const calc_delivery = (distance, fee) => {
    let price = distance * fee;
    if (price == 0)
        return 0;
    if (price < fee)
        price = fee;
    return price;
};
exports.default = {
    async list(request, response) {
        const lat = parseFloat(request.query.page);
        const log = parseFloat(request.query.limit);
        const range = getGeohashRange(lat, log, 30);
        const query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper);
        const data = await Restaurant_1.default.find(query);
        for (const restaurant of data) {
            restaurant.distance = calc_distance(restaurant.lat, restaurant.long, lat, log);
            restaurant.fee = calc_delivery(restaurant.distance, restaurant.delivery_price);
        }
        return response.json(data).status(200);
    },
    async find(request, response) {
        const { id } = request.params;
        const { lat, log } = request.body;
        const restaurant = await Restaurant_1.default.findById(id);
        if (!restaurant)
            return response.send("Not found").status(404);
        restaurant.distance = calc_distance(restaurant.lat, restaurant.long, lat, log);
        restaurant.fee = calc_delivery(restaurant.distance, restaurant.delivery_price);
        return response.send(restaurant);
    },
    async create(request, response) {
        const { name, category, delivery_price, lat, long, logo } = request.body;
        if (!(await schema_1.restaurantSchema.isValid({ name,
            logo,
            delivery_price,
            category,
            lat,
            long }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        const geoh = ngeohash_1.default.encode(lat, long);
        const restaurant = await Restaurant_1.default.create({
            name,
            logo,
            delivery_price,
            category,
            lat,
            long, geohash: geoh
        }, (0, uuid_1.v4)());
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
