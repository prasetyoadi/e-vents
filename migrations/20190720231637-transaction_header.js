module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('transaction_header', {
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
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    grand_total: {
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
  down: queryInterface => queryInterface.dropTable('transaction_header'),
};
