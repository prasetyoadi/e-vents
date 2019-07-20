module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('location', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
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
  down: queryInterface => queryInterface.dropTable('location'),
};
