"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
      },
      profilePhoto: {
        type: DataTypes.STRING(500),
        defaultValue: "",
      },
      telephoneNumber: DataTypes.STRING,
      countryCode: DataTypes.INTEGER,
      verificationCode: {
        type: DataTypes.JSONB(),
        defaultValue: { email: null, telephoneNumber: null },
      },
      codeExpiryTime: { type: DataTypes.JSONB() },
      isVerified: {
        type: DataTypes.JSONB(),
        defaultValue: { email: false, telephoneNumber: false },
      },
      fcmToken: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
