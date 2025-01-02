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
    const profiles = [
      {
        username: "user1",
        gender: "Male",
        imageUrl: "https://example.com/image1.jpg",
        userId: 1,
      },
      {
        username: "user2",
        gender: "Female",
        imageUrl: "https://example.com/image2.jpg",
        userId: 2,
      },
    ];

    profiles.forEach((el) => {
      el.updatedAt = el.createdAt = new Date();
    });

    await queryInterface.bulkInsert("Profiles", profiles, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Profiles", null, {});
  },
};
