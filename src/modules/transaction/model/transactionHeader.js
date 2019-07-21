import { Model } from 'sequelize';
import core from '../../core';

const { hashIdEncode, setDateFormat } = core.helpers;

export class TransactionHeader extends Model {
  static init(sequelize, DataTypes) {
    const options = ({
      sequelize,
      tableName: 'transaction_header',
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
    }, options);
  }

  static associate(sequelize) {
    this.Event = this.belongsTo(sequelize.Event, { as: 'event', foreignKey: 'event_id' });
    this.TransactionItem = this.hasMany(sequelize.TransactionItem, { as: 'items', foreignKey: 'transaction_header_id' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [
        this.Event,
        this.TransactionItem,
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

export default { TransactionHeader };
