"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;

    await queryInterface.createTable("workers", {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: { type: STRING(100), allowNull: false },
      email: { type: STRING(150), allowNull: false, unique: true },
      avatar: { type: STRING },
      password: { type: STRING, allowNull: false },
      createdAt: { type: DATE, allowNull: false },
      updatedAt: { type: DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workers");
  },
};
