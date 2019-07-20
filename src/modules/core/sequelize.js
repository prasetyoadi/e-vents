import { Sequelize } from 'sequelize';
import cfg from '../../../config';

/**
 * Connect to mysql instance
 * @param {string} config
 * @return {Promise}
 */
function connect(config) {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: config.debug,
    timezone: 'Asia/Jakarta',
    port: config.port,
  });
  return sequelize;
}

const db = connect(cfg.sequelize);

export { db };
export default { db };
