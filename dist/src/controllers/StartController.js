"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firefose_1 = require("firefose");
const Banner_1 = __importDefault(require("../model/Banner"));
const Category_1 = __importDefault(require("../model/Category"));
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const schema_1 = require("../schema");
const geoutils_1 = require("../utils/geoutils");
const schemautils_1 = require("../utils/schemautils");
exports.default = {
    async get(request, response) {
        let lat = request.params.lat;
        let long = request.params.long;
        if (!(await schema_1.startSchema.isValid({
            lat,
            long
        }))) {
            response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        const latitude = parseFloat(lat);
        const longitude = parseFloat(long);
        let range = (0, geoutils_1.getGeohashRange)(latitude, longitude, 10);
        let query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper)
            //.orderBy('total_rate', 'asc')
            .limit(10);
        const restaurants = await Restaurant_1.default.find(query);
        for (const restaurant of restaurants) {
            (0, schemautils_1.unpopulate_date)(restaurant);
        }
        const categories = await Category_1.default.find(new firefose_1.Query().orderBy('position', 'asc'));
        range = (0, geoutils_1.getGeohashRange)(latitude, longitude, 25);
        query = new firefose_1.Query()
            .where("loc", ">=", range.lower)
            .where("loc", "<=", range.upper);
        const banners = await Banner_1.default.find(query);
        return response.json({ restaurants, categories, banners }).status(200);
    }
};
