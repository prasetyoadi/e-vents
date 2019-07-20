import { Model } from 'sequelize';
import core from '../../core';

const { hashIdEncode, setDateFormat } = core.helpers;

export class Event extends Model {
  static init(sequelize, DataTypes) {
    const options = ({
      sequelize,
      tableName: 'event',
      freezeTableName: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    });

    super.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      location_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'location',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING(150),
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
    }, options);
  }

  static associate(sequelize) {
    this.Location = this.belongsTo(sequelize.Location, { as: 'location', foreignKey: 'location_id' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [
        this.Location,
      ]
    });
  }

  toJSON(encodeId = true) {
    const values = Object.assign({}, this.get());
    if (encodeId) values.id = hashIdEncode(values.id);
    values.created_at = setDateFormat(values.created_at, 'toUnix');
    values.updated_at = setDateFormat(values.updated_at, 'toUnix');

    values.start_date = setDateFormat(values.start_date, 'toDate');
    values.end_date = setDateFormat(values.end_date, 'toDate');

    delete values.location_id;

    return values;
  }
}

export default { Event };
