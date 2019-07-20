import express from 'express';
import { LocationRoutes } from './location';
import { EventRoutes } from './event';

const routes = express.Router();

routes.use(LocationRoutes);
routes.use(EventRoutes);

export default routes;
