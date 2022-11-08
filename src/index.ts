import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import {
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url} from './credentials.json'
    
import routes_v1 from './routes/v1';

const {connect} = require('firefose');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/v1', routes_v1)


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
    client_x509_cert_url}, "databaseURI")

app.listen(PORT, () =>
    console.log('Servidor rodando com sucesso', PORT)
);

