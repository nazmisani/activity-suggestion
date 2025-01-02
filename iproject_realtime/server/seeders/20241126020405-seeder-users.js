"use strict";

const { hash } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     *
     */

    const users = [
      {
        email: "user1@mail.com",
        password: "12345",
      },
      {
        email: "user2@mail.com",
        password: "12345",
      },
    ];

    users.forEach((el) => {
      el.password = hash(el.password);
      el.updatedAt = el.createdAt = new Date();
    });
    
    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
