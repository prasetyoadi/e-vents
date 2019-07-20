import coreModule from '../../core';
import { NotFoundError } from '../../../../common/errors';

export const LocationController = {};
export default { LocationController };

const sequelize = coreModule.sequelize.db;
const { hashIdDecode } = coreModule.helpers;

LocationController.get = async (req, res, next) => {
  const { Location } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Location.getById(decodedId);
  if (!data) {
    return next(new NotFoundError('Data not found'));
  }
  return res.API.success('Data.', { detail: data });
};

LocationController.list = async (req, res) => {
  const { Location } = sequelize.models;
  const { name } = req.query;
  const filter = {};
  if (name) {
    filter.name = name;
  }
  const data = await Location.findAll({
    where: filter,
  });
  return res.API.success('Data.', { list: data });
};

LocationController.edit = async (req, res, next) => {
  const { Location } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const reqBody = req.body;
  const data = await Location.findOne({ where: { id: decodedId } });
  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }
  data.updated_at = new Date();
  data.changed('updated_at', true);
  const update = await data.update(reqBody);
  return res.API.success('Data.', { detail: update });
};

LocationController.delete = async (req, res, next) => {
  const { Location } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Location.findOne({ where: { id: decodedId } });
  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }
  await data.destroy();
  return res.API.success('Success.', {});
};

LocationController.create = async (req, res) => {
  const { Location } = sequelize.models;
  const data = req.body;

  const insert = await Location.create(data);
  return res.API.success('Data.', { detail: insert });
};
