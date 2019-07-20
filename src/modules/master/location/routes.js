import express from 'express';
import coreModule from '../../core';
import { LocationController } from './controller';
import {
  validateCreate,
  validateUpdate,
} from './middleware';

const PREFIX = 'api';
const PREFIX_MODULE = 'location';

const routes = express.Router();
const { wrap } = coreModule.utils;

routes.put(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  validateUpdate(),
  wrap(LocationController.edit));

routes.delete(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(LocationController.delete));

routes.post(`/${PREFIX}/${PREFIX_MODULE}`,
  validateCreate(),
  wrap(LocationController.create));

routes.get(`/${PREFIX}/${PREFIX_MODULE}`,
  wrap(LocationController.list));

routes.get(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(LocationController.get));

export default routes;
