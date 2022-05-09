"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const excludedAttributes = ["salt", "deletedAt", "createdAt", "updatedAt"];
  class UserSecurityQuestions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.SecurityQuestions, {
        foreignKey: "questionId",
      });
    }
  }
  UserSecurityQuestions.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SecurityQuestions",
          key: "id",
        },
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      answer: {
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
      hooks: {
        beforeUpdate: (record, options) => {
          options.returning = utils.filterAttributes.filter.includeAttributes(
            UserSecurityQuestions
          );
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
      modelName: "UserSecurityQuestions",
    }
  );
  UserSecurityQuestions.excludedAttributes = excludedAttributes;
  return UserSecurityQuestions;
};
