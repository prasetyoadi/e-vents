module.exports = {
  apiConfig: {
    debug: true,
    logPath: "logs",
    port: 4000,
    apiHost: "localhost",
    host: "localhost",
    https: false
  },
  sequelizeConfig: {
    dialect: "mysql",
    database: "loket",
    port: 3310,
    host: "127.0.0.1",
    username: "root",
    password: "root",
    migrationStorageTableName: "sequelize_meta"
  }
}