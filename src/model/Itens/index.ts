const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const { Number } = SchemaTypes;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    restaurant: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        default: 1.5,
        require: true
    },
    description: {
        type: String,
        required: true
    }
}, {timestamp: true});

const Item = new Model("products", itemSchema);
export default Item;