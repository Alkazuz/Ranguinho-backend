"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const { connect } = require('firefose');
const restaurant_1 = __importDefault(require("./routes/restaurant"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const { type, project_id, private_key_id, private_key, client_email, client_id, auth_uri, token_uri, auth_provider_x509_cert_url, client_x509_cert_url } = process.env;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use('/restaurant', restaurant_1.default);
connect({
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url
}, "databaseURI");
app.listen(PORT, () => console.log('Servidor rodando com sucesso', PORT));
