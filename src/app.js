import 'babel-polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { DataTypes } from 'sequelize';
import cors from 'cors';
import helmet from 'helmet';
import _ from 'lodash';
import config from '../config';
import coreModule from './modules/core';
import masterModule from './modules/master';

const app = express();
const sequelize = coreModule.sequelize.db;

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection:', err.stack);
});

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

// set default express behavior
// disable x-powered-by signature
// and enable case-sensitive routing
app.set('env', config.env);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);

// set model
const models = [
  masterModule.model,
];

for (const modelCollection of models) {
  for (const modelKey in modelCollection) {
    if (Object.prototype.hasOwnProperty.call(modelCollection, modelKey)) {
      const model = modelCollection[modelKey];
      if (model.init && typeof model.init === 'function') {
        // console.log('register:', modelKey);
        model.init(sequelize, DataTypes);
      }
    }
  }
}

const sequelizeModels = sequelize.models;
_.forEach(Object.keys(models), (n) => {
  _.forEach(models[n], (model) => {
    if (model.associate !== undefined) {
      model.associate(sequelizeModels);
    }
  });
});

// configure middleware
app.use(coreModule.middleware.requestLoggerMiddleware());
app.use(coreModule.middleware.requestUtilsMiddleware());
app.use(coreModule.middleware.responseUtilsMiddleware());
app.use(coreModule.middleware.apiResponse());

app.use(coreModule.routes);
app.use(masterModule.routes);

// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  const err = new Error('Path not found');
  err.httpStatus = 404;
  next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('err stack', req.path, err);
  if (res.API) {
    res.API.error(err);
  } else {
    res.status(500).json({
      meta: {
        code: 400,
        status: false,
        message: 'Failed.',
      },
      data: {},
    });
  }
});

export default app;
