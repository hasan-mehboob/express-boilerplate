"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    [
      await queryInterface.addColumn(
        "NewsLetterSubscribers",
        "firstName",
        Sequelize.STRING
      ),
      await queryInterface.addColumn(
        "NewsLetterSubscribers",
        "lastName",
        Sequelize.STRING
      ),
    ];
  },

  async down(queryInterface, Sequelize) {
    [
      await queryInterface.removeColumn("NewsLetterSubscribers", "firstName"),
      await queryInterface.removeColumn("NewsLetterSubscribers", "lastName"),
    ];
  },
};
