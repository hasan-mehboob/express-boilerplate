"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SecurityQuestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SecurityQuestions.init(
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        references: {
          key: "id",
          model: "Admins",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SecurityQuestions",
    }
  );
  return SecurityQuestions;
};
