"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { String, Number, Array } = SchemaTypes;
const deliverySchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    restaurant: {
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
    price: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        default: -1,
        required: false
    },
    items: {
        type: Array,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamp: true });
const Delivery = new Model("delivery", deliverySchema);
exports.default = Delivery;
