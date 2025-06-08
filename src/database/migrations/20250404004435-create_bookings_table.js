"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DECIMAL, DATE, BOOLEAN } = Sequelize;

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
        type: DECIMAL(10, 2),
        allowNull: false,
      },

      extrasPrice: {
        type: DECIMAL(8, 2),
        allowNull: true,
      },

      totalPrice: {
        type: DECIMAL(10, 2),
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
      fields: ["startDate", "endDate"],
      type: "check",
      where: Sequelize.literal('"endDate" > "startDate"'),
      name: "check_endDate_after_startDate",
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["status"],
      type: "check",
      where: Sequelize.literal(
        "\"status\" IN ('unconfirmed', 'checked-in', 'checked-out')"
      ),
      name: "check_status_valid_values",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("bookings");
  },
};
