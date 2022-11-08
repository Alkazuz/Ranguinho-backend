"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
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
app.listen(PORT, () => console.log('Servidor rodando com sucesso', PORT));
