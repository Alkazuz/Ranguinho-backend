"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { Number, String } = SchemaTypes;
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    bannerUrl: {
        type: String,
        required: false
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
