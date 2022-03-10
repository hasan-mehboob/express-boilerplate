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
      fullName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      gender: { type: Sequelize.ENUM("male", "female") },
      password: {
        type: Sequelize.STRING,
      },
      profilePhoto: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      telephoneNumber: Sequelize.STRING,
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      meritalStatus: {
        type: Sequelize.ENUM("single", "married", "divorced"),
      },
      noOfChildern: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      zipCode: Sequelize.INTEGER,
      state: Sequelize.STRING,
      city: Sequelize.STRING,
      country: Sequelize.STRING,
      street: Sequelize.STRING,
      accessToken: {
        type: Sequelize.STRING,
        defaultValue: "",
      },
      verificationCode: {
        type: Sequelize.JSONB(),
        // set(value) {
        //   this.setDataValue("verificationCode", JSON.stringify(value));
        // },
        defaultValue: { email: null, telephoneNumber: null },
      },
      codeExpiryTime: { type: Sequelize.JSONB() },
      isVerified: {
        type: Sequelize.JSONB(),
        defaultValue: { email: false, telephoneNumber: false },
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