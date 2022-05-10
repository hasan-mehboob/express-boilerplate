"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserDevices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserDevices.init(
    {
      deviceType: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      requestHeaders: DataTypes.TEXT,
      deviceIdentifier: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserDevices",
    }
  );
  return UserDevices;
};
