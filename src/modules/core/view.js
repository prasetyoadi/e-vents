import _ from 'lodash';
import moment from 'moment';
import c from '../../constants';
import config from '../../../config';

export default (req) => {
  const forms = {};
  const url = {};
  const helper = {};

  helper._ = _;
  helper.moment = moment;

  /**
   * Display form error
   * @param {string} field
   * @return {string}
   * @deprecated
   */
  forms.error = (field) => {
    const errors = _.get(req, `messages.validation.${field}`);
    if (errors && Array.isArray(errors) && errors.length) {
      let html = '';
      errors.forEach(e => (html += `<span class="append error block">${e}</span>`));
      return html;
    }

    return '';
  };

  /**
   * Get file url of a given File object or File id
   * @param {Object|string} id
   * @return {string}
   */
  url.file = (id) => {
    if (_.isString(id)) {
      return `/file/${id}`;
    }

    if (_.has(id, '_id')) {
      // eslint-disable-next-line no-underscore-dangle
      return `/file/${id._id}`;
    }

    return '';
  };

  /**
   * Get static file
   * @param {string} file
   * @param {boolean} hasMinVersion
   * @return {string}
   */
  url.static = (file, hasMinVersion = true) => {
    const shouldUseMinVersion = _.includes([c.PRODUCTION, c.STAGING], config.env) && hasMinVersion;
    file = file.startsWith('/') ? file : `/${file}`;

    if (shouldUseMinVersion) {
      const parts = file.split('.');
      const ext = parts.pop();

      if (_.includes(['css', 'js'], ext)) {
        file = `${parts.join('.')}.min.${ext}`;
      }
    }

    const fileWithPrefix = `${config.staticFilePrefix}${file}`;
    if (config.staticFileNoCache) {
      const timestamp = new Date().getTime();
      return `${fileWithPrefix}?${timestamp}`;
    }

    return fileWithPrefix;
  };

  return { forms, url, helper };
};
