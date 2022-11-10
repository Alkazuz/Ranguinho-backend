const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String} = SchemaTypes;

const addressSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    neighborhood:{
        type: String,
        required: true
    }
}, {timestamps: true});

const Address = new Model("address", addressSchema);
export default Address;