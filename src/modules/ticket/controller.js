// import { Op } from 'sequelize';
import coreModule from '../core';
import { BadRequestError, NotFoundError } from '../../../common/errors';

export const TicketController = {};
export default { TicketController };

const sequelize = coreModule.sequelize.db;
const {
  hashIdDecode,
  paginationBuilder,
} = coreModule.helpers;

const choiceType = (value) => {
  if (!['REGULER', 'FREE', 'PREMIUM'].includes(value) || !value) {
    return false;
  }

  return true;
};

TicketController.get = async (req, res, next) => {
  const { Ticket } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Ticket.getById(decodedId);
  if (!data) {
    return next(new NotFoundError('Data not found'));
  }
  return res.API.success('Data.', { detail: data });
};


TicketController.list = async (req, res) => {
  const { Ticket, Event } = sequelize.models;
  const { page, limit, offset } = paginationBuilder(req.query);
  // const { q } = req.query;

  const filter = {};

  const data = await Ticket.findAndCountAll({
    where: filter,
    include: [{
      model: Event,
      as: 'event',
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

TicketController.create = async (req, res, next) => {
  const { Ticket, Event } = sequelize.models;

  const reqBody = req.body;

  const decodedEventId = hashIdDecode(reqBody.event_id);

  const eventIsExist = await Event.findOne({ where: { id: decodedEventId } });

  if (!eventIsExist) {
    return next(new BadRequestError('Event not found'));
  }

  if (!choiceType(reqBody.type)) {
    return next(new BadRequestError('Type is wrong'));
  }

  const ticketTypeIsExist = await Ticket.findOne({
    where: {
      event_id: decodedEventId,
      type: reqBody.type,
    }
  });

  if (ticketTypeIsExist) {
    return next(new BadRequestError(`${reqBody.type} type already exist for this event `));
  }

  const payload = {
    event_id: decodedEventId,
    type: reqBody.type,
    qty: reqBody.qty || 0,
    price: reqBody.price || 0,
  };

  const insert = await Ticket.create(payload);
  return res.API.success('Data.', { detail: insert });
};

TicketController.edit = async (req, res, next) => {
  const { Ticket, Event } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const reqBody = req.body;

  const data = await Ticket.findOne({ where: { id: decodedId } });

  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }

  const decodedEventId = hashIdDecode(reqBody.event_id);
  const EventIsExist = await Event.findOne({ swhere: { id: decodedEventId } });

  if (!EventIsExist) {
    return next(new BadRequestError('Event not found'));
  }

  if (!choiceType(reqBody.type)) {
    return next(new BadRequestError('Type is wrong'));
  }

  const payload = {
    event_id: decodedEventId,
    name: reqBody.name,
    qty: reqBody.qty || 0,
    price: reqBody.price || 0,
  };

  data.updated_at = new Date();
  data.changed('updated_at', true);

  const update = await data.update(payload);
  return res.API.success('Data.', { detail: update });
};

TicketController.delete = async (req, res, next) => {
  const { Ticket } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await Ticket.findOne({ where: { id: decodedId } });
  if (!data) {
    const err = new NotFoundError('Not found');
    return next(err);
  }
  await data.destroy();
  return res.API.success('Success.', {});
};
