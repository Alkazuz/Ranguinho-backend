import { GeoPoint } from "firebase/firestore";

const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String, Number} = SchemaTypes;

const categorySchema = new Schema({
    color: {
        type: String
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    position: {
        type: Number,
    }
});

const Category = new Model("category", categorySchema);
export default Category;