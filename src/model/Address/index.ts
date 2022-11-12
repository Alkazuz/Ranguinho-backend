const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number} = SchemaTypes;

const addressSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        default: "user"
    },
    city: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long:{
        type: Number,
        required: true
    },
    geohash: {
        type: String,
        required: true
    },
    neighborhood:{
        type: String,
        required: true
    }
});

const Address = new Model("address", addressSchema);
export default Address;