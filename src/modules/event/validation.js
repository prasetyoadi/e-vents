const constraints = {};

constraints.create = {
  location_id: {
    presence: true,
  },
  name: {
    presence: true,
  },
  start_date: {
    presence: true,
  },
  end_date: {
    presence: true,
  },
};

constraints.update = {
  location_id: {
    presence: true,
  },
  name: {
    presence: true,
  },
  start_date: {
    presence: true,
  },
  end_date: {
    presence: true,
  },
};

export default constraints;
