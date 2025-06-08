"use strict";

const { DECIMAL } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DECIMAL, DATE } = Sequelize;

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
        type: DECIMAL(10, 2),
        allowNull: false,
      },
      discount: {
        type: DECIMAL(5, 2),
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
      where: Sequelize.literal('"maxCapacity" >= 1'),
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
      where: Sequelize.literal(
        '("image" IS NULL OR "image" ~ \'^https?://.*\\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$\')'
      ),
      name: "check_image_url_format",
    });

    await queryInterface.addConstraint("cabins", {
      fields: ["description"],
      type: "check",
      where: Sequelize.literal(
        '("description" IS NULL OR char_length("description") <= 500)'
      ),
      name: "check_description_length",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("cabins");
  },
};
