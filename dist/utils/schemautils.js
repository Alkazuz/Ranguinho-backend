"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.process_restaurant_ful = exports.unpopulate_date = exports.populate_fields = void 0;
const Address_1 = __importDefault(require("../model/Address"));
const geoutils_1 = require("./geoutils");
exports.populate_fields = [
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
const unpopulate_date = (restaurant) => {
    for (const populate of exports.populate_fields) {
        delete restaurant[populate];
    }
};
exports.unpopulate_date = unpopulate_date;
const process_restaurant_ful = async (restaurant, lat, lng) => {
    if (!restaurant.address.lat) {
        restaurant.address = await Address_1.default.findById(restaurant.address);
    }
    restaurant.distance = (0, geoutils_1.calc_distance)(restaurant.address.lat, restaurant.address.long, lat, lng);
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
    (0, exports.unpopulate_date)(restaurant);
};
exports.process_restaurant_ful = process_restaurant_ful;
