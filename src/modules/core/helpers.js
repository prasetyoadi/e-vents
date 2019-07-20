import Hashids from 'hashids';
import moment from 'moment';
import _ from 'lodash';

export const setDateFormat = (str = null, action = 'default') => {
  let output = '';

  const datetime = str === null ? moment() : str;

  switch (action) {
    case 'default':
    default:
      output = moment(datetime).format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'toUnix':
      output = moment(datetime).unix();
      break;
    case 'isDate':
      output = moment(str, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss');
      break;
    case 'toDate':
      output = moment(str).format('YYYY-MM-DD');
      break;
  }

  return output;
};

export const hashIdEncode = (str, key = '') => {
  const hashids = new Hashids(key, 10);
  return hashids.encode(str);
};

export const hashIdDecode = (str, key = '') => {
  const hashids = new Hashids(key, 10);
  const decodeStr = hashids.decode(str);
  return decodeStr.length > 0 ? decodeStr[0] : null;
};

export const flattenErrorMessage = obj => _(obj).values().flatten().value();

export const paginationBuilder = (queryString) => {
  const { sort = 'id:desc' } = queryString;
  let { limit = 10, page = 1 } = queryString;
  limit = Number(limit);
  const offset = limit * (page < 1 ? 0 : page - 1);
  if (limit < 0) limit = 0;
  if (page < 1) page = 1;
  if (limit === '0') {
    limit = Number.MAX_SAFE_INTEGER;
  }
  let order;
  if (sort) {
    const tmp = sort.split(':');
    const sortField = tmp[0] || 'id';
    const sortType = tmp[1] || 'desc';
    order = [sortField, sortType];
  }
  page = Number(page);
  return {
    order, page, limit, offset,
  };
};

export default {
  hashIdEncode,
  hashIdDecode,
  setDateFormat,
  flattenErrorMessage,
  paginationBuilder,
};
