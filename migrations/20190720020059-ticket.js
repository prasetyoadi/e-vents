module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('ticket', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'event',
        key: 'id',
      },
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      values: ['PREMIUM', 'REGULER', 'FREE'],
      allowNull: false,
      unique: true,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE(),
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE(),
      defaultValue: DataTypes.NOW,
    },
  }),
  down: queryInterface => queryInterface.dropTable('ticket'),
};
