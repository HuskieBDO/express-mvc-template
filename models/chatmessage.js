const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChatMessage.hasOne(models.User, {
        foreignKey: 'id',
        sourceKey: 'userId',
        as: 'user',
      });
    }
  }
  ChatMessage.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'User', key: 'id' },
        onDelete: 'cascade',
        allowNull: false,
      },
      commentedId: {
        type: DataTypes.INTEGER,
        references: { model: 'ChatMessage', key: 'id' },
        onDelete: 'cascade',
      },
      text: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ChatMessage',
    }
  );
  return ChatMessage;
};
