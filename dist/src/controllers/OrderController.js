"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const firefose_1 = require("firefose");
const Delivery_1 = __importDefault(require("../model/Delivery"));
exports.default = {
    async get(request, response) {
        if (!request.headers.authorization || request.headers.authorization.split(' ')[0] !== 'Bearer') {
            return response.status(403).json({ error: 'No credentials sent!' });
        }
        const authToken = request.headers.authorization.split(' ')[1];
        try {
            const userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            const userid = userInfo.uid;
            const deliveries = await Delivery_1.default.find(new firefose_1.Query().where('userid', '==', userid).populate('address').populate('delivery_status'));
            return response.status(200).json(deliveries);
        }
        catch (e) {
            return response
                .status(401)
                .send({ error: 'You are not authorized to make this request' });
        }
    }
};
