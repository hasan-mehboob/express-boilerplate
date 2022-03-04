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
        type: DataTypes.STRING,
        default: "",
      },
      telephoneNumber: DataTypes.STRING,
      accessToken: {
        type: DataTypes.STRING,
        default: "",
      },
      verificationCode: {
        type: DataTypes.INTEGER,
        default: 0,
      },
      codeExpiryTime: { type: DataTypes.DATE },
      isVerified: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
