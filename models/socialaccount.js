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
        allowNull: false,
      },
      sid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SocialAccount',
    }
  );
  return SocialAccount;
};
