const constraints = {};

constraints.create = {
  event_id: {
    presence: true,
  },
  type: {
    presence: true,
  },
  qty: {
    presence: true,
  },
  price: {
    presence: true,
  },
};

constraints.update = {
  event_id: {
    presence: true,
  },
  type: {
    presence: true,
  },
  qty: {
    presence: true,
  },
  price: {
    presence: true,
  },
};

export default constraints;
