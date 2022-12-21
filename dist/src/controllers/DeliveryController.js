"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const ngeohash_1 = __importDefault(require("ngeohash"));
const Address_1 = __importDefault(require("../model/Address"));
const Delivery_1 = __importDefault(require("../model/Delivery"));
const DeliveryStatus_1 = __importDefault(require("../model/DeliveryStatus"));
const Product_1 = __importDefault(require("../model/Product"));
const uuid_1 = require("uuid");
const Restaurant_1 = __importDefault(require("../model/Restaurant"));
const schema_1 = require("../schema");
const geoutils_1 = require("../utils/geoutils");
exports.default = {
    async create(request, response) {
        if (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            return response.status(403).json({ error: 'No credentials sent!' });
        }
        const authToken = request.headers.authorization.split(' ')[1];
        const { restaurant, items, lat, long } = request.body;
        console.log(request.body);
        if (!(await schema_1.deliverySchema.isValid({
            lat,
            long,
            restaurant
        }))) {
            return response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        try {
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            const userid = userInfo.uid;
            const restaurant_model = await Restaurant_1.default.findById(restaurant);
            if (!restaurant_model)
                return response.status(401).json({ message: 'Restaurante não existe' });
            const geoh = ngeohash_1.default.encode(lat, long);
            const geodata = JSON.parse(JSON.stringify(await geoutils_1.geocoder.reverse({ lat: lat, lon: long })))[0];
            const address = await Address_1.default.create({
                state: geodata.administrativeLevels.level1short,
                city: geodata.administrativeLevels.level2short,
                neighborhood: geodata.extra.neighborhood,
                entity: 'delivery',
                geohash: geoh,
                lat: lat,
                long: long,
            }, (0, uuid_1.v4)());
            let price = 0;
            items.forEach(async (item) => {
                const product = await Product_1.default.findById(item.id);
                if (!product)
                    return response.status(401).json({ message: 'Produto colocado não existe' });
                price += product.price * item.count;
            });
            const delivery_status = await DeliveryStatus_1.default.findById('lwJNSjMmyBnNhtCU5OSN');
            const uuid = (0, uuid_1.v4)();
            let delivery = await Delivery_1.default.create({
                userid: userid,
                restaurant: restaurant_model.id,
                address: address.id,
                price: price,
                uid: uuid,
                items: items,
                delivery_status: delivery_status.id
            }, uuid);
            return response.status(201).json(delivery);
        }
        catch (e) {
            return response
                .status(401)
                .send({ error: 'You are not authorized to make this request' });
        }
    }
};
