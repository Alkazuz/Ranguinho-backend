"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Delivery_1 = __importDefault(require("../model/Delivery"));
const Itens_1 = __importDefault(require("../model/Itens"));
exports.default = {
    async create(request, response) {
        //const appCheckToken = request.header('X-Firebase-AppCheck');
        //if (!appCheckToken) {
        //    return response.status(401).send('Unauthorized');
        //}
        const { uid, restaurant, items, lat, long } = request.body;
        try {
            //const appCheckClaims = await admin.appCheck().verifyToken(appCheckToken);
            let price_total = 0;
            for (let item of items) {
                const item_model = await Itens_1.default.findById(item.uid);
                price_total += item.count * item_model.price;
            }
            const delivery = await Delivery_1.default.create({ userid: uid, restaurant: restaurant, price: price_total, lat, long, items }, uuidv4());
            return response.status(200).json(delivery);
        }
        catch (err) {
            return response.status(401).json({ message: 'Unauthorized' });
        }
    },
    async rate(request, response) {
        const { uid, user, rate } = request.body;
        const delivery = await Delivery_1.default.findById(uid);
        if (!delivery || delivery.userid != user)
            return response.status(401).json({ message: 'Unauthorized' });
        await delivery.updateById(uid, { rate });
        return response.status(200).json({ message: 'Ok' });
    }
};
function uuidv4() {
    throw new Error('Function not implemented.');
}
