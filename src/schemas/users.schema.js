"use strict";
const { USER_ROLE } = constants;
const { Model } = require("sequelize");
const { SIGNUP_STAGES } = require("../../config/constants");
const auth = require("../../config/auth");
module.exports = (sequelize, DataTypes) => {
  const excludedAttributes = [
    "password",
    "salt",
    "deletedAt",
    "createdAt",
    "updatedAt",
    "accessToken",
  ];
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.RefreshTokens, {
        foreignKey: "userId",
      });
    }
  }
  Users.init(
    {
      firstName: DataTypes.STRING,
      fullName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      gender: { type: DataTypes.ENUM("male", "female") },

      email: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
      },
      salt: {
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
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      meritalStatus: {
        type: DataTypes.ENUM("single", "married", "divorced"),
      },
      noOfChildern: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      zipCode: DataTypes.INTEGER,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      street: DataTypes.STRING,
    },
    {
      defaultScope: {
        attributes: {
          exclude: excludedAttributes,
        },
      },
      hooks: {
        beforeUpdate: (record, options) => {
          options.returning =
            utils.filterAttributes.filter.includeAttributes(Users);
        },
        afterCreate: (record, options) => {
          record = utils.filterAttributes.filter.excludeAttributes(
            record,
            excludedAttributes,
            options?.includedAttributes ?? []
          );
        },
      },
      sequelize,
      modelName: USER_ROLE.USER,
    }
  );
  Users.excludedAttributes = excludedAttributes;
  Users.excludedAttributesFromRequest = [
    "createdAt",
    "updatedAt",
    "isVerified",
    "verificationCode",
    "codeExpiryTime",
  ];
  Users.getjwtToken = ({ user, rememberMe = false }) => {
    const payload = { id: user.id };
    const accessToken = utils.token.getJWTToken({
      secret: auth.accessToken.secret,
      expiry: auth.accessToken.expiry,
      payload: {
        ...payload,
        email: user.email,
        model: USER_ROLE.USER,
      },
    });
    const refreshToken = utils.token.getJWTToken({
      secret: auth.refreshToken.secret,
      expiry: rememberMe
        ? auth.refreshToken.rememberMeExpiry
        : auth.refreshToken.expiry,
      payload,
    });
    return { accessToken, refreshToken };
  };
  return Users;
};
