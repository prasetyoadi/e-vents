const path = require('path');
const cfg = require('../common/config');

const def = {};

// setup default env
def.env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = def.env;

def.debug = true;
def.https = false;
def.host = 'localhost';
def.apiHost = 'localhost';
def.port = 4000;

// sequelize config
def.sequelize = {};
def.sequelize.debug = console.log;
def.sequelize.username = 'root';
def.sequelize.password = 'root';
def.sequelize.database = 'loket';
def.sequelize.host = '127.0.0.1';
def.sequelize.port = 3310;
def.sequelize.dialect = 'mysql';

// paths
const rootDir = path.dirname(__dirname);
def.logPath = path.join(rootDir, 'logs');

cfg.resolveLocalConfig(__dirname, (err, file) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  if (!err) cfg.merge(def, require(file));
});

module.exports = def;
