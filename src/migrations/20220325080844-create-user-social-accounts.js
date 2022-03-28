"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserSocialAccounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: { type: Sequelize.STRING },
      fullName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      transportUid: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING,
      },
      accessToken: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      profilePhoto: {
        type: Sequelize.STRING(400),
        defaultValue: "",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserSocialAccounts");
  },
};
