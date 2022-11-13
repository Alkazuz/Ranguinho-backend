const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number} = SchemaTypes;

const deliveryStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code:{
        type: Number,
        required: true
    }
}, {timestamps: true});

const DeliveryStatus = new Model("delivery_status", deliveryStatusSchema);
export default DeliveryStatus;