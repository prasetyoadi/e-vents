import validate from 'validate.js';
import constraints from './validation';
import { BadRequestError } from '../../../common/errors';

// eslint-disable-next-line
export function validateCreate() {
  return (req, res, next) => {
    const hasError = validate(req.body, constraints.create);
    if (hasError) {
      return next(new BadRequestError('Failed.', hasError));
    }
    return next();
  };
}
