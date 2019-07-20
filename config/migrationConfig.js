const { sequelize, env } = require('./index');

const cfg = {};
cfg[env] = sequelize;

module.exports = cfg;
