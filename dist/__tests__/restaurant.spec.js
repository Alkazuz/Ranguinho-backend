"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firefose_1 = require("firefose");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const ngeohash_1 = __importDefault(require("ngeohash"));
const credentials_json_1 = require("../src/credentials.json");
const geoutils_1 = require("../src/utils/geoutils");
const Restaurant_1 = __importDefault(require("../src/model/Restaurant"));
const schemautils_1 = require("../src/utils/schemautils");
const Address_1 = __importDefault(require("../src/model/Address"));
const Category_1 = __importDefault(require("../src/model/Category"));
describe('Restaurant Model', () => {
    const geo = { lat: -19.0066077, long: -57.6472559 };
    beforeEach(() => {
        if (firebase_admin_1.default.apps.length === 0) {
            (0, firefose_1.connect)({
                project_id: credentials_json_1.project_id,
                private_key: credentials_json_1.private_key,
                client_email: credentials_json_1.client_email
            });
        }
    });
    it('should create restaurant with reference address & category', async () => {
        const geoh = ngeohash_1.default.encode(geo.lat, geo.long);
        const category_model = await Category_1.default.find(new firefose_1.Query().where("name", "==", 'Lanches'));
        expect(category_model).toBeDefined();
        expect(category_model).toHaveLength(1);
        const category = category_model[0];
        const geodata = JSON.parse(JSON.stringify(await geoutils_1.geocoder.reverse({ lat: geo.lat, lon: geo.long })))[0];
        const address = await Address_1.default.create({
            state: geodata.administrativeLevels.level1short,
            city: geodata.administrativeLevels.level2short,
            neighborhood: geodata.extra.neighborhood,
            entity: 'restaurant',
            geohash: geoh,
            lat: geo.lat,
            long: geo.long,
        }, 'test');
        await Restaurant_1.default.create({
            name: 'test',
            logo: 'test',
            delivery_price: 1,
            bannerURL: 'test',
            category: category.id,
            geohash: geoh,
            address: address.id,
        }, 'test');
        const query = new firefose_1.Query();
        query.where('name', '==', 'test').populate('address').populate('category');
        const result = await Restaurant_1.default.find(query);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('id');
        // @ts-ignore
        expect(result[0]?.category).toHaveProperty('id');
        // @ts-ignore
        expect(result[0]?.category).toHaveProperty('name');
        // @ts-ignore
        expect(result[0]?.category).toHaveProperty('image');
        // @ts-ignore
        expect(result[0]?.category).toHaveProperty('position');
        // @ts-ignore
        expect(result[0]?.category).toHaveProperty('color');
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('id');
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('city');
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('state');
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('neighborhood');
    });
    it('should test nearby restaurants', async () => {
        const range = (0, geoutils_1.getGeohashRange)(geo.lat, geo.long, 10);
        const query = new firefose_1.Query()
            .where("geohash", ">=", range.lower)
            .where("geohash", "<=", range.upper).populate('address');
        const restaurants = await Restaurant_1.default.find(query);
        expect(restaurants).toBeDefined();
        expect(restaurants.length).toBeGreaterThan(0);
        for (const restaurant of restaurants) {
            const distance = (0, geoutils_1.calc_distance)(geo.lat, geo.long, restaurant.address.lat, restaurant.address.long);
            expect(distance).toBeLessThanOrEqual(10);
        }
    });
    it('should remove sensitive data', async () => {
        const restaurants = await Restaurant_1.default.find(new firefose_1.Query());
        expect(restaurants).toBeDefined();
        for (const restaurant of restaurants) {
            (0, schemautils_1.unpopulate_date)(restaurant);
            for (const fields of schemautils_1.populate_fields) {
                expect(restaurant).not.toHaveProperty(fields);
            }
        }
    });
    it('should delete restaurant and your references', async () => {
        await Address_1.default.deleteById('test');
        await Restaurant_1.default.deleteById('test');
        const restaurant = await Restaurant_1.default.findById('test');
        const address = await Address_1.default.findById('test');
        expect(restaurant).toBeNull();
        expect(address).toBeNull();
    });
});
