"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const excludedAttributes = ["deletedAt", "createdAt", "updatedAt"];
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
      defaultScope: {
        attributes: {
          exclude: excludedAttributes,
        },
      },
      hooks: {
        afterCreate: (record, options) => {
          record = utils.filterAttributes.filter.excludeAttributes(
            record,
            excludedAttributes,
            options?.includedAttributes ? options?.includedAttributes : []
          );
        },
      },
      sequelize,
      modelName: "SecurityQuestions",
    }
  );
  SecurityQuestions.excludedAttributes = excludedAttributes;
  return SecurityQuestions;
};
