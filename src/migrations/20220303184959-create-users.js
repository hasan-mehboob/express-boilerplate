"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
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
      email: { type: Sequelize.STRING },
      password: {
        type: Sequelize.STRING,
      },
      profilePhoto: {
        type: Sequelize.STRING,
        default: "",
      },
      telephoneNumber: Sequelize.STRING,
      accessToken: {
        type: Sequelize.STRING,
        default: "",
      },
      verificationCode: {
        type: Sequelize.INTEGER,
        default: 0,
      },
      codeExpiryTime: { type: Sequelize.DATE },
      isVerified: {
        type: Sequelize.BOOLEAN,
        default: false,
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
    await queryInterface.dropTable("Users");
  },
};
