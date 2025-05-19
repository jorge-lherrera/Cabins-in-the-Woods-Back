"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE, BOOLEAN } = Sequelize;

    await queryInterface.createTable("workers", {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: STRING(100),
        allowNull: false,
      },
      email: {
        type: STRING(150),
        allowNull: false,
        unique: true,
      },
      avatar: {
        type: STRING,
      },
      password: {
        type: STRING,
        allowNull: false,
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

    await queryInterface.addConstraint("workers", {
      fields: ["name"],
      type: "check",
      where: Sequelize.literal('char_length("name") BETWEEN 1 AND 100'),
      name: "check_name_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["email"],
      type: "check",
      where: Sequelize.literal('char_length("email") <= 150'),
      name: "check_email_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["email"],
      type: "check",
      where: Sequelize.literal("\"email\" ~ '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'"),
      name: "check_email_format",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["avatar"],
      type: "check",
      where: Sequelize.literal(
        '("avatar" IS NULL OR "avatar" ~ \'^https?://\')'
      ),
      name: "check_avatar_url",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["password"],
      type: "check",
      where: Sequelize.literal('char_length("password") BETWEEN 8 AND 100'),
      name: "check_password_length",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workers");
  },
};
