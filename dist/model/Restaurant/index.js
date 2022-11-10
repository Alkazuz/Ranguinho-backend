"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { Number, Date, ObjectId, String } = SchemaTypes;
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    address_info: {
        type: ObjectId,
        required: true,
        ref: 'address'
    },
    bannerUrl: {
        type: String,
        required: false
    },
    total_deliveries: {
        type: Number,
        default: 0
    },
    total_deliveries_rate: {
        type: Number,
        default: 0
    },
    total_rate: {
        type: Number,
        default: 0
    },
    delivery_price: {
        type: Number,
        default: 1.5,
        require: true
    },
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date
    },
    timeMinMinutes: {
        type: Number,
        default: 30,
    },
    timeMaxMinutes: {
        type: Number,
        default: 50,
    },
    category: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    geohash: {
        type: String,
        required: true
    }
}, { timestamp: true });
const Restaurant = new Model("restaurant", restaurantSchema);
exports.default = Restaurant;
