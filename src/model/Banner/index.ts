const {Schema, Model} = require('firefose');
const {SchemaTypes} = require('firefose');
const {String} = SchemaTypes;

const bannerSchema = new Schema({
    image: {
        type: String
    },
    link: {
        type: String
    },
    loc: {
        type: String
    }
});

const Banner = new Model("banner", bannerSchema);
export default Banner;