"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, FLOAT, DATE, BOOLEAN } = Sequelize;

    await queryInterface.createTable("bookings", {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      cabinId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: "cabins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      guestId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: "guests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      startDate: {
        type: DATE,
        allowNull: false,
      },
      endDate: {
        type: DATE,
        allowNull: false,
      },
      numNights: {
        type: INTEGER,
        allowNull: false,
      },
      numGuests: {
        type: INTEGER,
        allowNull: false,
      },
      cabinPrice: {
        type: FLOAT,
        allowNull: false,
      },
      extrasPrice: {
        type: FLOAT,
        allowNull: true,
      },
      totalPrice: {
        type: FLOAT,
        allowNull: false,
      },
      hasBreakfast: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      observations: {
        type: STRING(255),
        allowNull: true,
      },
      isPaid: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: STRING,
        allowNull: false,
        defaultValue: "unconfirmed",
        validate: {
          isIn: {
            args: [["unconfirmed", "checked-in", "checked-out"]],
            msg: "Status inválido para a reserva.",
          },
        },
      },
      createdAt: {
        type: DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DATE,
        allowNull: false,
      },
    });

    // Constraints
    await queryInterface.addConstraint("bookings", {
      fields: ["numNights"],
      type: "check",
      where: Sequelize.literal('"numNights" >= 1'),
      name: "check_num_nights_positive",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["numGuests"],
      type: "check",
      where: Sequelize.literal('"numGuests" >= 1'),
      name: "check_num_guests_positive",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["cabinPrice"],
      type: "check",
      where: Sequelize.literal('"cabinPrice" >= 0'),
      name: "check_cabin_price_non_negative",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["extrasPrice"],
      type: "check",
      where: Sequelize.literal('("extrasPrice" IS NULL OR "extrasPrice" >= 0)'),
      name: "check_extras_price_non_negative",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["totalPrice"],
      type: "check",
      where: Sequelize.literal('"totalPrice" >= 0'),
      name: "check_total_price_non_negative",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["observations"],
      type: "check",
      where: Sequelize.literal(
        '("observations" IS NULL OR char_length("observations") <= 255)'
      ),
      name: "check_observations_length",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["startDate", "endDate"],
      type: "check",
      where: Sequelize.literal('"endDate" > "startDate"'),
      name: "check_endDate_after_startDate",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  },
};
