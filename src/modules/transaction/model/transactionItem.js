import { Model } from 'sequelize';
import core from '../../core';
import { S_IRWXU } from 'constants';

const { hashIdEncode, setDateFormat } = core.helpers;

export class TransactionItem extends Model {
  static init(sequelize, DataTypes) {
    const options = ({
      sequelize,
      tableName: 'transaction_item',
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
      transaction_header_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'transactionHeader',
          key: 'id',
        },
      },
      ticket_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
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
    }, options);
  }

  static associate(sequelize) {
    this.TransactionHeader = this.belongsTo(sequelize.TransactionHeader, { as: 'header', foreignKey: 'transaction_header_id' });
    this.Ticket = this.belongsTo(sequelize.Ticket, { as: 'ticket', foreignKey: 'ticket_id' });
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
      include: [
        this.TransactionHeader,
        this.Ticket,
      ],
    });
  }

  toJSON(encodeId = true) {
    const values = Object.assign({}, this.get());
    if (encodeId) values.id = hashIdEncode(values.id);
    values.created_at = setDateFormat(values.created_at, 'toUnix');
    values.updated_at = setDateFormat(values.updated_at, 'toUnix');

    delete values.ticket_id;
    delete values.transaction_header_id;

    return values;
  }
}

export default { TransactionItem };
