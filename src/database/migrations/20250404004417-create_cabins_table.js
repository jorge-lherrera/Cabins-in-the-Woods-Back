"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cabins", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      guestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "guests",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      maxCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      regularPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      discount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cabins");
  },
};
