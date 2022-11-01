import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const {connect} = require('firefose');
import restaurantRoutes from './routes/restaurant';

import geohash from "ngeohash";

const PORT = process.env.PORT || 3000;

const app = express();

const {
    type,
    project_id,
    private_key_id,
    private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url} = process.env

app.use(express.json());
app.use(cors());

app.use(morgan('dev'));

app.use('/restaurant', restaurantRoutes);

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

