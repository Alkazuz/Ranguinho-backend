const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
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
    image: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        default: 1.5,
        require: true
    },
    category:{
        type: String,
        required: true,
        ref: 'category'
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Product = new Model("products", productSchema);
export default Product;