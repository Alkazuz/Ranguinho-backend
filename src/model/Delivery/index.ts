const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number, Array} = SchemaTypes;

const deliverySchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    restaurant:{
        type: String,
        required: true,
        ref: 'restaurant'
    },
    address: {
        type: SchemaTypes.ObjectId,
        required: true,
        ref: 'address'
    },
    price: {
        type: Number,
        required: true
    },
    rate:{
        type: Number,
        default: -1,
        required: false
    },
    items: {
        type: Array,
        required: true
    },
    delivery_status: {
        type: SchemaTypes.ObjectId,
        required: true,
        def: 'delivery_status'
    }
}, {timestamps: true});

const Delivery = new Model("delivery", deliverySchema);
export default Delivery;