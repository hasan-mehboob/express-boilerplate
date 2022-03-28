"use strict";
const { Model } = require("sequelize");
const { SIGNUP_STAGES } = require("../../config/constants");

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
      telephoneNumber: DataTypes.BIGINT,
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
      signupStage: {
        type: DataTypes.ENUM(
          SIGNUP_STAGES.VERIFY_CODE,
          SIGNUP_STAGES.COMPLETE_PROFILE,
          SIGNUP_STAGES.SUCCESS
        ),
        defaultValue: SIGNUP_STAGES.VERIFY_CODE,
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
  Users.excludedAttributes = [
    "password",
    "salt",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  Users.excludedAttributesFromRequest = [
    "createdAt",
    "updatedAt",
    "isVerified",
    "verificationCode",
    "codeExpiryTime",
  ];

  return Users;
};

const verificationCodeDefault = { email: null, telephoneNumber: null };
