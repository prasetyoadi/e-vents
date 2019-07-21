module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('transaction_item', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_header_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'transaction_header',
        key: 'id',
      },
    },
    ticket_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'ticket',
        key: 'id',
      },
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
    total: {
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
  down: queryInterface => queryInterface.dropTable('transaction_item'),
};
