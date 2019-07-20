import express from 'express';

const routes = express.Router();

routes.get('/status', (req, res) => res.status(200).json({ status: 'ok' }));
routes.get('/favicon.ico', (req, res) => res.status(204));

export default routes;
