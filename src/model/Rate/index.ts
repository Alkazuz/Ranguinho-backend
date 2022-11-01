const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');

const {String, Number, ObjectId} = SchemaTypes;

const rateSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    delivery: {
        type: ObjectId,
        required: true
    },
    description: {
        type: String,
        required: false
    }
}, {timestamp: true});

const Rate = new Model("rate", rateSchema);
export default Rate;