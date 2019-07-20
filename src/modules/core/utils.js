import _ from 'lodash';
import cfg from '../../../config';
import { BadRequestError } from '../../../common/errors';

/**
 * Wrap controller function
 * @param {function} fn
 */
export function wrap(fn) {
  return (...args) => {
    try {
      if (!fn) throw new Error('Undefined function');
      const result = fn(...args);
      if (result && _.isFunction(result.catch)) {
        result.catch(args[2]);
      }

      return result;
    } catch (e) {
      return args[2](e);
    }
  };
}

/**
 * Wrapper function for config
 * @param {string} key
 * @param {*} defaultValue
 */
export function config(key, defaultValue) {
  if (cfg[key] === undefined) {
    return defaultValue;
  }

  return cfg[key];
}

/**
 * Format error other than validate.js, for consistent error response.
 * Singular because once the error encountered the api will throw the error,
 * thus not allowing it to have multiple error messages
 * @param obj {string} the object property of the message
 * @param message {string}
 */
export function formatSingularErr(obj, message) {
  return { [obj]: [message] };
}

/**
 * Format bad request error
 * @param field {string} field that causes error
 * @param msg {string} message of the error
 */
export function formatError(field, msg) {
  const data = formatSingularErr(field, this[msg]);
  return new BadRequestError(this[msg], data);
}

export const setJSON = (val) => {
  if (typeof val !== 'string') {
    try {
      val = JSON.stringify(val);
    } catch (e) {
      val = null;
    }
  }

  return val;
};

export const getJSON = (val) => {
  let newVal = null;
  try {
    newVal = val ? JSON.parse(val) : val;
  } catch (e) {
    return val;
  }

  return newVal;
};
