import express from 'express';
import coreModule from '../core';
import { TransactionController } from './controller';
import {
  validateCreate,
} from './middleware';

const PREFIX = 'api';
const PREFIX_MODULE = 'transaction';

const routes = express.Router();
const { wrap } = coreModule.utils;

routes.post(`/${PREFIX}/${PREFIX_MODULE}`,
  validateCreate(),
  wrap(TransactionController.create));

routes.post(`/${PREFIX}/${PREFIX_MODULE}/purchase`,
  validateCreate(),
  wrap(TransactionController.create));

routes.get(`/${PREFIX}/${PREFIX_MODULE}/get_info`,
  wrap(TransactionController.list));

routes.get(`/${PREFIX}/${PREFIX_MODULE}/:id`,
  wrap(TransactionController.get));

export default routes;
