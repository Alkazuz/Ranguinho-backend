"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { Number } = SchemaTypes;
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    delivery_price: {
        type: Number,
        default: 1.5,
        require: true
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
