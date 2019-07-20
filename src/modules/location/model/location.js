import { Model } from 'sequelize';
import coreModule from '../../core';

const { hashIdEncode, setDateFormat } = coreModule.helpers;

export class Location extends Model {
  static init(sequelize, DataTypes) {
    const options = ({
      sequelize,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'location',
      freezeTableName: true,
      timestamps: true,
      underscored: true,
    });

    super.init({
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(150),
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
    }, options);
  }

  static async getById(id) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  toJSON(encodeId = true) {
    const values = Object.assign({}, this.get());
    if (encodeId) values.id = hashIdEncode(values.id);
    values.created_at = setDateFormat(values.created_at, 'toUnix');
    values.updated_at = setDateFormat(values.updated_at, 'toUnix');
    return values;
  }
}

export default { Location };
