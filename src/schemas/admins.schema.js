"use strict";
const { Model } = require("sequelize");
const auth = require("../../config/auth");

module.exports = (sequelize, DataTypes) => {
  const excludedAttributes = [
    "password",
    "salt",
    "deletedAt",
    "createdAt",
    "updatedAt",
  ];
  class Admins extends Model {
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
  Admins.init(
    {
      salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      defaultScope: {
        attributes: {
          exclude: excludedAttributes,
        },
      },
      sequelize,
      modelName: "Admins",
    }
  );
  Admins.excludedAttributes = excludedAttributes;
  Admins.getjwtToken = ({ user, remember_me = false }) => {
    const payload = { id: user.id };
    const accessToken = utils.token.getJWTToken({
      secret: auth.accessToken.secret,
      expiry: auth.accessToken.expiry,
      payload: {
        ...payload,
        email: user.email,
        model: "users",
      },
    });
    const refreshToken = utils.token.getJWTToken({
      secret: auth.refreshToken.secret,
      expiry: remember_me
        ? auth.refreshToken.rememberMeExpiry
        : auth.refreshToken.expiry,
      payload,
    });
    return {
      accessToken,
      refreshToken,
    };
  };
  return Admins;
};
