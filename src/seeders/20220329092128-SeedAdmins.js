"use strict";
const crypto = require("crypto");
const {
  SALT: salt,
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  HASH_ALGO,
} = process.env;
module.exports = {
  async up(queryInterface, Sequelize) {
    const hmac = crypto.createHmac(HASH_ALGO, salt);
    hmac.update(DEFAULT_ADMIN_PASSWORD);
    const password = hmac.digest("hex");
    await queryInterface.bulkInsert(
      "Admins",
      [
        {
          email: DEFAULT_ADMIN_EMAIL,
          password,
          salt,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("Admins", null, {});
  },
};
