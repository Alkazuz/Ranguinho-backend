"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDeliveryNoitification = void 0;
exports.default = {
    async onDeliveryCreate(event) {
        console.log(event);
    },
    async onDeliveryUpdate(event) {
        console.log(event);
    }
};
async function sendDeliveryNoitification(snap, context) {
    console.log('fewfewge');
    return console.log(snap);
}
exports.sendDeliveryNoitification = sendDeliveryNoitification;
