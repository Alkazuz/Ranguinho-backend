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
exports.onUpdate = exports.onCreate = exports.firestoreInstance = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const credentials_json_1 = require("./credentials.json");
const v1_1 = __importDefault(require("./routes/v1"));
const { connect } = require('firefose');
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/v1', v1_1.default);
connect({
    type: credentials_json_1.type,
    project_id: credentials_json_1.project_id,
    private_key_id: credentials_json_1.private_key_id,
    private_key: credentials_json_1.private_key,
    client_email: credentials_json_1.client_email,
    client_id: credentials_json_1.client_id,
    auth_uri: credentials_json_1.auth_uri,
    token_uri: credentials_json_1.token_uri,
    auth_provider_x509_cert_url: credentials_json_1.auth_provider_x509_cert_url,
    client_x509_cert_url: credentials_json_1.client_x509_cert_url
}, "databaseURI");
exports.firestoreInstance = admin.firestore();
app.listen(PORT, () => console.log('Servidor rodando com sucesso', PORT));
console.log('aaaa');
exports.onCreate = functions.firestore
    .document('delivery/{delivery}')
    .onCreate((snap, context) => {
    const newValue = snap.data();
    console.log('aaaaa');
    return exports.firestoreInstance.doc('check_function/jjjj').set(newValue);
});
exports.onUpdate = functions.firestore
    .document('delivery/{deliveryId}')
    .onUpdate((snap, context) => {
    return console.log('aaaaa');
});
