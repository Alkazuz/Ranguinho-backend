const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array, ObjectId} = SchemaTypes;

const deliverySchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    restaurant:{
        type: ObjectId,
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
    items: {
        type: Map,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    }
}, {timestamp: true});

const Delivery = new Model("delivery", deliverySchema);
export default Delivery;