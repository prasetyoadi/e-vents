import moment from 'moment';
import morgan from 'morgan';
import _ from 'lodash';
import winston from 'winston';
import 'winston-daily-rotate-file';
import config from '../../../config';
import view from './view';
// import utils from '../../../common/utils';
import { flattenErrorMessage } from './helpers';

/**
 * Request logger middleware
 * @return {function}
 */
export function requestLoggerMiddleware() {
  const { format } = winston;
  const myFormat = format.printf(info => `${info.timestamp}: ${info.message}`);
  const logger = winston.createLogger({
    format: format.combine(
      format.timestamp(),
      myFormat,
    ),
    transports: [
      new winston.transports.DailyRotateFile({
        filename: 'log-%DATE%.log',
        dirname: config.logPath,
        datePattern: 'YYYY-MM-DD',
        // prepend: true,
        zippedArchive: true,
        // level: 'debug',
        timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
        json: false,
      }),
    ],
  });

  logger.stream = {
    write: (message) => {
      logger.info(message);
    },
  };
  morgan.token('body', (req, res) => `\nrequest header: ${JSON.stringify(req.headers, null, 2)}\nrequest body: ${JSON.stringify(req.body, null, 2)}\nresponse body: ${JSON.stringify(res.APIResponse, null, 2)}`);
  return morgan(':method :url :response-time ms :body', { stream: logger.stream });
}

/**
 * Add some utilities to request object
 * @return {function}
 */
export function requestUtilsMiddleware() {
  return (req, res, next) => {
    req.messages = {
      errors: [],
      warnings: [],
      validation: {},
    };
    next();
  };
}

// eslint-disable-next-line no-unused-vars
export function apiResponse() {
  return (req, res, next) => {
    const response = {};
    // response.meta = {};

    const defaultResponse = (code, status, message, data, error = null) => {
      if (error && Object.keys(error).length === 0) error = null;
      const output = {
        meta: {
          code,
          status,
          message,
        },
        data,
        error,
      };
      res.APIResponse = output;
      return output;
    };

    /**
     * Add API success responder
     * @param {string} message
     * @param {object} data, returned data
     * @param {object} meta, meta data
     */
    response.success = (message, data = {}, meta = {}) => {
      if (data.pagination && data.pagination.current_page) {
        data.pagination.current_page = parseInt(data.pagination.current_page);
      }
      if (data.pagination && data.pagination.limit) {
        data.pagination.limit = parseInt(data.pagination.limit);
      }
      if (data.pagination && data.pagination.total_page) {
        data.pagination.total_page = parseInt(data.pagination.total_page);
      }
      if (data.pagination && data.pagination.total_rows) {
        data.pagination.total_rows = parseInt(data.pagination.total_rows);
      }
      return res.status(200).json(defaultResponse(200, true, message, data, null, meta));
    };

    /**
     * Add API error responder
     * @param {object} error, error object data
     */
    response.error = (error) => {
      const { httpStatus = 500 } = error;
      let { previousError = error } = error;
      let { message = 'Error' } = error;
      // eslint-disable-next-line
      if (!previousError.httpStatus && Array.isArray(previousError[Object.keys(previousError)[0]])) {
        const flatMessage = flattenErrorMessage(previousError).join(', ');
        if (flatMessage) message = flatMessage;
      } else {
        previousError = {
          message: [message],
        };
      }
      delete previousError.httpStatus;
      delete previousError.message;
      return res.status(httpStatus)
        .json(defaultResponse(httpStatus, false, message, null, previousError, {}));
    };

    res.API = response;
    next();
  };
}

export function apiErrorResponse() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => res.API.error(err);
}

/**
 * Add some utilities to response object
 * @return {function}
 */
export function responseUtilsMiddleware() {
  return (req, res, next) => {
    const util = view(req);
    res.model = vars => Object.assign({},
      vars,
      { util, utils: util },
      { req },
      { config },
      { _ },
      { moment });
    res.todo = () => {
      res.status(501);
      res.send('Not Implemented');
    };
    next();
  };
}
