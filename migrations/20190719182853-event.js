module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('event', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    location_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'location',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    start_date: {
      type: DataTypes.DATE(),
      allowNull: true,
      defaultValue: null,
    },
    end_date: {
      type: DataTypes.DATE(),
      allowNull: true,
      defaultValue: null,
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
  down: queryInterface => queryInterface.dropTable('event'),
};
