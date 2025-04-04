"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bookings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cabinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "cabins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      guestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "guests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      numNights: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numGuests: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      cabinPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      extrasPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      hasBreakfast: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      observations: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable("bookings");
  },
};
