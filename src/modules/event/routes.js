import express from 'express';
import coreModule from '../core';
import { EventController } from './controller';
import {
  validateCreate,
  validateUpdate,
} from './middleware';

const PREFIX = 'api';
const PREFIX_MODULE = 'event';

const routes = express.Router();
const { wrap } = coreModule.utils;

routes.put(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  validateUpdate(),
  wrap(EventController.edit));

routes.delete(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(EventController.delete));

routes.post(`/${PREFIX}/${PREFIX_MODULE}`,
  validateCreate(),
  wrap(EventController.create));

routes.get(`/${PREFIX}/${PREFIX_MODULE}`,
  wrap(EventController.list));

routes.get(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(EventController.get));

export default routes;
