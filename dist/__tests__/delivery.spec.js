"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firefose_1 = require("firefose");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const ngeohash_1 = __importDefault(require("ngeohash"));
const credentials_json_1 = require("../src/credentials.json");
const Address_1 = __importDefault(require("../src/model/Address"));
const DeliveryStatus_1 = __importDefault(require("../src/model/DeliveryStatus"));
const Delivery_1 = __importDefault(require("../src/model/Delivery"));
const Product_1 = __importDefault(require("../src/model/Product"));
const geoutils_1 = require("../src/utils/geoutils");
describe('Delivery Model', () => {
    const geo = { lat: -19.0066077, long: -57.6472559 };
    const items = [
        {
            id: '7n3Ffi7rtL4EzWj0m3PK',
            count: 2,
            description: 'Descrição do produto 1'
        }
    ];
    beforeEach(() => {
        if (firebase_admin_1.default.apps.length === 0) {
            (0, firefose_1.connect)({
                project_id: credentials_json_1.project_id,
                private_key: credentials_json_1.private_key,
                client_email: credentials_json_1.client_email
            });
        }
    });
    it('should create delivery with existent products and existent restaurant', async () => {
        const geoh = ngeohash_1.default.encode(geo.lat, geo.long);
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
        let price = 0;
        items.forEach(async (item) => {
            const product = await Product_1.default.findById(item.id);
            expect(product).toBeDefined();
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('description');
            price += product.price * item.count;
        });
        const delivery_status = await DeliveryStatus_1.default.findById('lwJNSjMmyBnNhtCU5OSN');
        expect(delivery_status).toBeDefined();
        expect(delivery_status).toHaveProperty('id');
        let delivery = await Delivery_1.default.create({
            userid: '3L6Al5wtfnfnDR6vBGrdq4o9obh1',
            restaurant: 'b26713e6-b435-4f21-b985-ba56c4b24a0c',
            address: address.id,
            price: price,
            uid: 'test',
            items: items,
            delivery_status: delivery_status.id
        }, 'test');
        delivery = await Delivery_1.default.findById('test');
        expect(delivery).toBeDefined();
        expect(delivery).toHaveProperty('userid');
        expect(delivery).toHaveProperty('restaurant');
        expect(delivery).toHaveProperty('address');
        expect(delivery).toHaveProperty('price');
        expect(delivery?.price).toEqual(41.8);
    });
    it('should all items of a delivery order', async () => {
        const delivery = await Delivery_1.default.findById('test');
        expect(delivery).toBeDefined();
        expect(delivery).toHaveProperty('items');
        const query = new firefose_1.Query();
        delivery.items.forEach((item) => query.where('uid', '==', item.id));
        const products = await Product_1.default.find(query);
        expect(products).toHaveLength(1);
    });
    it('should delete test delivery', async () => {
        await Delivery_1.default.deleteById('test');
        const delivery = await Delivery_1.default.findById('test');
        expect(delivery).toBeNull();
    });
});
