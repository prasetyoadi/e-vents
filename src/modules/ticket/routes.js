import express from 'express';
import coreModule from '../core';
import { TicketController } from './controller';
import {
  validateCreate,
  validateUpdate,
} from './middleware';

const PREFIX = 'api';
const PREFIX_MODULE = 'ticket';

const routes = express.Router();
const { wrap } = coreModule.utils;

routes.put(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  validateUpdate(),
  wrap(TicketController.edit));

routes.delete(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(TicketController.delete));

routes.post(`/${PREFIX}/${PREFIX_MODULE}`,
  validateCreate(),
  wrap(TicketController.create));

routes.post(`/${PREFIX}/event/${PREFIX_MODULE}/create`,
  validateCreate(),
  wrap(TicketController.create));

routes.get(`/${PREFIX}/${PREFIX_MODULE}`,
  wrap(TicketController.list));

routes.get(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(TicketController.get));

export default routes;
