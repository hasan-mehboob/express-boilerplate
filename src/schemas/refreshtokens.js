"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
      });
      this.belongsTo(models.Admins, {
        as: "admin",
        foreignKey: "userId",
      });
    }
  }
  RefreshTokens.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      modelType: {
        type: DataTypes.ENUM("Users", "Admins"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RefreshTokens",
    }
  );
  return RefreshTokens;
};
