"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSocialAccounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSocialAccounts.init(
    {
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: { type: DataTypes.STRING },
      fullName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      provider: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tranasportUid: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "UserSocialAccounts",
    }
  );
  return UserSocialAccounts;
};
