'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SocialAccount.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'id' },
      },
      sid: DataTypes.INTEGER,
      provider: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'SocialAccount',
    }
  );
  return SocialAccount;
};
