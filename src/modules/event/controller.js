import moment from 'moment';
// import { Op } from 'sequelize';
import coreModule from '../core';
import { BadRequestError, NotFoundError } from '../../../common/errors';

export const EventController = {};
export default { EventController };

const sequelize = coreModule.sequelize.db;
const {
  hashIdDecode,
  paginationBuilder,
  // setDateFormat,
} = coreModule.helpers;

EventController.get = async (req, res, next) => {
  const { Event } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Event.getById(decodedId);
  if (!data) {
    return next(new NotFoundError('Data not found'));
  }
  return res.API.success('Data.', { detail: data });
};


EventController.list = async (req, res) => {
  const { Event, Location } = sequelize.models;
  const { page, limit, offset } = paginationBuilder(req.query);
  // const { q } = req.query;

  const filter = {};

  const data = await Event.findAndCountAll({
    where: filter,
    include: [{
      model: Location,
      as: 'location',
    }],
    limit,
    offset,
    order: [['created_at', 'desc']],
  });

  const pages = Math.ceil(data.count / limit);

  return res.API.success('Data.', {
    list: data.rows,
    pagination: {
      limit,
      total_page: pages,
      total_rows: data.count,
      current_page: page,
    },
  });
};

EventController.create = async (req, res, next) => {
  const { Event, Location } = sequelize.models;

  const reqBody = req.body;

  const decodedLocationId = hashIdDecode(reqBody.location_id);

  const locationIsExist = await Location.findOne({ swhere: { id: decodedLocationId } });

  if (!locationIsExist) {
    return next(new BadRequestError('Location not found'));
  }

  try {
    const startDate = moment(reqBody.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00:00');
    const endDate = moment(reqBody.end_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');
    const payload = {
      location_id: decodedLocationId,
      name: reqBody.name,
      start_date: startDate,
      end_date: endDate,
    };

    const insert = await Event.create(payload);
    return res.API.success('Data.', { detail: insert });
  } catch (e) {
    return next(new BadRequestError('start_date / end_date is invalid format date'));
  }
};

EventController.edit = async (req, res, next) => {
  const { Event, Location } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const reqBody = req.body;

  const data = await Event.findOne({ where: { id: decodedId } });

  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }

  const decodedLocationId = hashIdDecode(reqBody.location_id);
  const locationIsExist = await Location.findOne({ swhere: { id: decodedLocationId } });

  if (!locationIsExist) {
    return next(new BadRequestError('Location not found'));
  }

  try {
    const startDate = moment(reqBody.start_date, 'YYYY-MM-DD').format('YYYY-MM-DD 00:00:00');
    const endDate = moment(reqBody.end_date, 'YYYY-MM-DD').format('YYYY-MM-DD 23:59:59');

    const payload = {
      location_id: decodedLocationId,
      name: reqBody.name,
      start_date: startDate,
      end_date: endDate,
    };

    data.updated_at = new Date();
    data.changed('updated_at', true);

    const update = await data.update(payload);
    return res.API.success('Data.', { detail: update });
  } catch (e) {
    return next(new BadRequestError('start_date / end_date is invalid format date'));
  }
};

EventController.delete = async (req, res, next) => {
  const { Event } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Event.findOne({ where: { id: decodedId } });
  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }
  await data.destroy();
  return res.API.success('Success.', {});
};
