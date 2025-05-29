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

    await queryInterface.addConstraint("workers", {
      fields: ["name"],
      type: "check",
      where: Sequelize.literal(
        `char_length("name") BETWEEN 3 AND 100 AND "name" ~ '^[\\p{L}\\s]+$'`
      ),
      name: "check_name_letters_spaces_no_emojis",
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
      fields: ["email"],
      type: "check",
      where: Sequelize.literal("\"email\" ~ '^[\\p{L}\\d@._-]+$'"),
      name: "check_email_no_emojis",
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
      fields: ["avatar"],
      type: "check",
      where: Sequelize.literal(
        '("avatar" IS NULL OR "avatar" ~ \'^[\\p{L}\\d@._\\-:/]+$\')'
      ),
      name: "check_avatar_no_emojis",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["password"],
      type: "check",
      where: Sequelize.literal('char_length("password") BETWEEN 8 AND 100'),
      name: "check_password_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["password"],
      type: "check",
      where: Sequelize.literal("\"password\" ~ '^[\\p{L}\\d@._-]+$'"),
      name: "check_password_no_emojis",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workers");
  },
};
