"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { Number, ObjectId, String } = SchemaTypes;
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    address: {
        type: ObjectId,
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
    timeMinMinutes: {
        type: Number,
        default: 30,
    },
    timeMaxMinutes: {
        type: Number,
        default: 50,
    },
    geohash: {
        type: String,
    },
    category: {
        type: String,
        required: true,
        ref: 'category'
    },
}, { timestamps: true });
const Restaurant = new Model("restaurant", restaurantSchema);
exports.default = Restaurant;
