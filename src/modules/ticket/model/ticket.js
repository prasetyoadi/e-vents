import { Model } from 'sequelize';
import core from '../../core';

const { hashIdEncode, setDateFormat } = core.helpers;

export class Ticket extends Model {
  static init(sequelize, DataTypes) {
    const options = ({
      sequelize,
      tableName: 'ticket',
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
      event_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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
    }, options);
  }

  static associate(sequelize) {
    this.Event = this.belongsTo(sequelize.Event, { as: 'event', foreignKey: 'event_id' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [
        this.Event,
      ],
    });
  }

  toJSON(encodeId = true) {
    const values = Object.assign({}, this.get());
    if (encodeId) values.id = hashIdEncode(values.id);
    values.created_at = setDateFormat(values.created_at, 'toUnix');
    values.updated_at = setDateFormat(values.updated_at, 'toUnix');

    delete values.event_id;

    return values;
  }
}

export default { Ticket };
