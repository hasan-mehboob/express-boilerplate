"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserSecurityQuestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSecurityQuestions.init(
    {
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SecurityQuestions",
          key: "id",
        },
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserSecurityQuestions",
    }
  );
  return UserSecurityQuestions;
};
