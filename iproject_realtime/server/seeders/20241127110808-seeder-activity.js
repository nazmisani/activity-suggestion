"use strict";

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
     */

    const myActivity = [
      {
        name: "running",
        userId: 1,
      },
      {
        name: "take a bath",
        userId: 1,
      },
      {
        name: "sleep",
        userId: 2,
      },
      {
        name: "eat some food",
        userId: 2,
      },
    ];

    myActivity.forEach((el) => {
      el.updatedAt = el.createdAt = new Date();
    });

    await queryInterface.bulkInsert("MyActivities", myActivity, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("MyActivities", null, {});
  },
};
