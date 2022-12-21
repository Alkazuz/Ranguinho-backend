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
const Address_1 = __importDefault(require("../model/Address"));
const schemautils_1 = require("../utils/schemautils");
const geoutils_1 = require("../utils/geoutils");
const Category_1 = __importDefault(require("../model/Category"));
const Product_1 = __importDefault(require("../model/Product"));
exports.default = {
    async list(request, response) {
        const lat = parseFloat(request.query.lat);
        const lng = parseFloat(request.query.lng);
        const page = parseInt(request.query.page);
        const { category } = request.query;
        const range = (0, geoutils_1.getGeohashRange)(lat, lng, 10);
        const query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper);
        let category_where;
        if (category) {
            const category_model = await Category_1.default.find(new firefose_1.Query().where("name", '==', category));
            if (category_model && category_model.length > 0) {
                category_where = category_model[0].id;
                //query.where("category", "==", category_model[0].id) // causing Error: 9 FAILED_PRECONDITION:
            }
        }
        if (category_where) {
            query.where("category", "==", category_where);
        }
        query.offset(page * 10).limit(10).populate('address').populate('category');
        const data = await Restaurant_1.default.find(query);
        for (const restaurant of data) {
            (0, schemautils_1.process_restaurant_ful)(restaurant, lat, lng);
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
        const products = await Product_1.default.find(new firefose_1.Query().where("restaurant", "==", id));
        await (0, schemautils_1.process_restaurant_ful)(restaurant, lat, lng);
        restaurant.products = products;
        return response.json(restaurant);
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
        let category_model = await Category_1.default.find(new firefose_1.Query().where("name", "==", category));
        if (!category_model || category_model.length == 0) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        category_model = category_model[0];
        const geoh = ngeohash_1.default.encode(lat, long);
        const geodata = await geoutils_1.geocoder.reverse({ lat: lat, lon: long });
        const address = await Address_1.default.create({
            state: geodata[0].administrativeLevels.level1short,
            city: geodata[0].administrativeLevels.level2short,
            neighborhood: geodata[0].extra.neighborhood,
            entity: 'delivery',
            geohash: geoh,
            lat,
            long
        });
        const restaurant = await Restaurant_1.default.create({
            name,
            logo,
            delivery_price,
            geohash: geoh,
            bannerUrl: bannerURL,
            category: category_model.id,
            address: address.id,
        }, (0, uuid_1.v4)());
        return response.status(200).json({
            message: 'Restaurante criado com sucesso',
            restaurant,
        });
    }
};
