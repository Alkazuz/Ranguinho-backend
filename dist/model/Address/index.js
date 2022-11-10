"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { String } = SchemaTypes;
const addressSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    }
}, { timestamp: true });
const Address = new Model("address", addressSchema);
exports.default = Address;
