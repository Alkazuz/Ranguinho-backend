/*
    Rota responsável por enviar categorias, melhores restaurantes e alguns banners
*/

import express from 'express';
import StartController from '../../../controllers/StartController';
const routes = express.Router();

routes.get('/:lat/:long', StartController.get);

export default routes;