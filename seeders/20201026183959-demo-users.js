"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Tony Stark",
          username: "ironman",
          password: "prettyawesome",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Clark Kent",
          username: "superman",
          password: "canfly",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bruce Wayne",
          username: "batman",
          password: "hasgadgets",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
