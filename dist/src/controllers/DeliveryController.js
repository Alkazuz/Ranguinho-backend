"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        //const appCheckToken = request.header('X-Firebase-AppCheck');
        //if (!appCheckToken) {
        //    return response.status(401).send('Unauthorized');
        //}
        const { userid, restaurant, items, lat, long } = request.body;
        if (!(await schema_1.deliverySchema.isValid({
            lat,
            long,
            items,
            restaurant,
            userid
        }))) {
            response
                .status(401)
                .json({ message: 'dados fornecidos incorretamente' });
        }
        try {
            //const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
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
        catch (err) {
            return response.status(401).json({ message: err.message });
        }
    }
};
