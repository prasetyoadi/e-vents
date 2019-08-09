const path = require('path');
const config = require('config');
const def = {
  ...config.get('apiConfig'),
  env: process.env.NODE_ENV || 'development',
  logPath: path.join(path.dirname(__dirname), config.get('apiConfig.logPath')),
  sequelize:{
    ...config.get('sequelizeConfig'),
    debug: console.log
  }
};
// setup default env
process.env.NODE_ENV = def.env;

module.exports = def;
