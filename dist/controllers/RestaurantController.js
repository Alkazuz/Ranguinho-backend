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
const __1 = require("..");
const Address_1 = __importDefault(require("../model/Address"));
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
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
    return parseFloat((c * r).toFixed(1));
};
const populate_fields = [
    'updatedAt',
    'createdAt',
    'timeMinMinutes',
    'timeMaxMinutes',
    'lat',
    'fee',
    'long',
    'geohash',
    'total_deliveries',
    'total_rate',
    'delivery_price',
    'address'
];
const calc_delivery = (distance, fee) => {
    let price = distance * fee;
    if (price == 0)
        return 0;
    if (price < fee)
        price = fee;
    return price;
};
const process_restaurant_ful = (restaurant, lat, lng) => {
    restaurant.distance = calc_distance(restaurant.lat, restaurant.long, lat, lng);
    const current_date = new Date();
    const isNew = new Date().setDate(current_date.getDate() - 14) < restaurant.createdAt;
    const delivery_info = {
        type: 'DELIVERY',
        timeMinMinutes: restaurant.timeMinMinutes,
        timeMaxMinutes: restaurant.timeMaxMinutes,
        fee: calc_delivery(restaurant.distance, restaurant.delivery_price)
    };
    if (restaurant.total_rate && restaurant.total_rate > 0 && restaurant.total_deliveries && restaurant.total_deliveries > 0) {
        restaurant.rate = restaurant.total_rate / restaurant.total_deliveries;
    }
    else {
        restaurant.rate = 0;
    }
    restaurant.isNew = isNew;
    restaurant.delivery_info = delivery_info;
    for (const populate of populate_fields) {
        delete restaurant[populate];
    }
};
exports.default = {
    async list(request, response) {
        const lat = parseFloat(request.query.lat);
        const lng = parseFloat(request.query.lng);
        const page = parseInt(request.query.page);
        const range = getGeohashRange(lat, lng, 30);
        const query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper)
            .offset(page * 10).limit(10);
        const data = await Restaurant_1.default.find(query);
        for (const restaurant of data) {
            process_restaurant_ful(restaurant, lat, lng);
        }
        return response.json(data).status(200);
    },
    async update(request, response) {
        const id = request.params.id;
        const dataBody = request.body.data;
        const data = JSON.parse(JSON.stringify(dataBody));
        let restaurant = await Restaurant_1.default.findById(id);
        if (!restaurant)
            return response.send("Not found").status(404);
        data.updatedAt = new Date();
        restaurant = await Restaurant_1.default.updateById(id, data);
        if (restaurant)
            return response.json(restaurant).status(200);
        return response.send("Erro").status(202);
    },
    async find(request, response) {
        const lat = parseFloat(request.query.lat);
        const lng = parseFloat(request.query.lng);
        const id = request.params.id;
        const restaurant = await Restaurant_1.default.findById(id);
        if (!restaurant)
            return response.send("Not found").status(404);
        process_restaurant_ful(restaurant, lat, lng);
        return response.send(restaurant);
    },
    async create(request, response) {
        const { name, category, delivery_price, lat, long, logo, bannerURL } = request.body;
        if (!(await schema_1.restaurantSchema.isValid({ name,
            logo,
            delivery_price,
            category,
            bannerURL,
            lat,
            long }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        const geoh = ngeohash_1.default.encode(lat, long);
        const geodata = JSON.parse(JSON.stringify(await __1.geocoder.reverse({ lat: lat, lon: long })))[0];
        const address = await Address_1.default.create({ state: geodata.administrativeLevels.level1short, city: geodata.administrativeLevels.level2short, neighborhood: geodata.extra.neighborhood });
        const restaurant = await Restaurant_1.default.create({
            name,
            logo,
            delivery_price,
            bannerURL,
            category,
            lat,
            createdAt: new Date(),
            updatedAt: new Date(),
            long,
            address_info: address,
            geohash: geoh
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
