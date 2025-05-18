"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, FLOAT, DATE } = Sequelize;

    await queryInterface.createTable("cabins", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: INTEGER,
      },
      name: {
        type: STRING(100),
        allowNull: false,
      },
      maxCapacity: {
        type: INTEGER,
        allowNull: false,
      },
      regularPrice: {
        type: FLOAT,
        allowNull: false,
      },
      discount: {
        type: FLOAT,
        allowNull: true,
      },
      image: {
        type: STRING,
        allowNull: true,
      },
      description: {
        type: STRING(500),
        allowNull: true,
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
    await queryInterface.addConstraint("cabins", {
      fields: ["name"],
      type: "unique",
      name: "unique_cabin_name",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["name"],
      type: "check",
      where: Sequelize.literal('char_length("name") BETWEEN 3 AND 100'),
      name: "check_cabin_name_length",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["maxCapacity"],
      type: "check",
      where: Sequelize.literal('"maxCapacity" > 0'),
      name: "check_max_capacity_positive",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["regularPrice"],
      type: "check",
      where: Sequelize.literal('"regularPrice" >= 0'),
      name: "check_regular_price_non_negative",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["discount"],
      type: "check",
      where: Sequelize.literal(
        '("discount" IS NULL OR ("discount" >= 0 AND "discount" <= 100))'
      ),
      name: "check_discount_range",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["image"],
      type: "check",
      where: Sequelize.literal('("image" IS NULL OR "image" ~ \'^https?://\')'),
      name: "check_image_url",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["description"],
      type: "check",
      where: Sequelize.literal(
        '("description" IS NULL OR char_length("description") <= 255)'
      ),
      name: "check_description_length",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cabins");
  },
};
