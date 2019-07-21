// import { Op } from 'sequelize';
import coreModule from '../core';
import { BadRequestError, NotFoundError } from '../../../common/errors';

export const TransactionController = {};
export default { TransactionController };

const sequelize = coreModule.sequelize.db;
const {
  hashIdDecode,
  paginationBuilder,
  findDuplicateValuesInArray,
  setDateFormat,
} = coreModule.helpers;

const choiceType = (value) => {
  if (!['REGULER', 'FREE', 'PREMIUM'].includes(value) || !value) {
    return false;
  }

  return true;
};

TransactionController.get = async (req, res, next) => {
  const { TransactionHeader } = sequelize.models;
  const { id } = req.params;
  const decodedId = hashIdDecode(id);
  const data = await TransactionHeader.getById(decodedId);
  if (!data) {
    return next(new NotFoundError('Data not found'));
  }
  return res.API.success('Data.', { detail: data });
};

TransactionController.create = async (req, res, next) => {
  const { TransactionHeader, TransactionItem, Event, Ticket } = sequelize.models;

  const reqBody = req.body;

  const decodedEventId = hashIdDecode(reqBody.event_id);

  const event = await Event.getById(decodedEventId);

  if (!event) {
    return next(new BadRequestError('Event not found'));
  }

  const ticketTypeDuplicated = findDuplicateValuesInArray(reqBody.items.map(i => i.ticket_type));

  if (ticketTypeDuplicated.length > 0) {
    return next(new BadRequestError('Ticket Type must be unique on each transaction'));
  }

  let totalQty = 0;
  let totalPrice = 0;
  let items = [];

  const availableQuotaTicket = await Promise.all(reqBody.items.map(async (item) => {
    const checkTicket = event.ticket.find(i => i.type === item.ticket_type);
    const ticketQuota = checkTicket.qty || 0;

    if (ticketQuota >= item.qty) {
      totalQty += item.qty;
      totalPrice += (item.qty * checkTicket.price);

      // subtract quota qty on each ticket
      checkTicket.qty -= item.qty;

      items.push({
        ticket_id: checkTicket.id,
        qty: item.qty,
        price: checkTicket.price,
        total: (checkTicket.price * item.qty),
      });

      return true;
    }

    return false;
  }));

  if (availableQuotaTicket.includes(false)) {
    return next(new BadRequestError('There is ticket type with qty not available'));
  }

  const payload = {
    event_id: event.id,
    qty: totalQty,
    grand_total: totalPrice,
  };

  const insertHeader = await TransactionHeader.create(payload);

  if (insertHeader) {
    const payloadItems = items.map(item => Object.assign({ transaction_header_id: insertHeader.id }, item));

    await TransactionItem.bulkCreate(payloadItems);

    // Update quota tickets
    await Promise.all(event.ticket.map(async (ticket) => {
      await Ticket.update(
        { qty: ticket.qty, updated_at: setDateFormat() },
        { where: { id: ticket.id } }
      );
    }));
  }

  return res.API.success('Insert transaction successfully');
};
