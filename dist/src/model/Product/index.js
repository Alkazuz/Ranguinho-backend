"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Schema, Model } = require('firefose');
const { SchemaTypes } = require('firefose');
const { Number } = SchemaTypes;
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        required: true,
        ref: 'category'
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });
const Product = new Model("product", productSchema);
exports.default = Product;
