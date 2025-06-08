"use strict";

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
        '(char_length("name") >= 3 AND char_length("name") <= 100)'
      ),
      name: "check_name_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["email"],
      type: "check",
      where: Sequelize.literal(
        '(char_length("email") >= 1 AND char_length("email") <= 150 AND "email" ~ \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$\')'
      ),
      name: "check_email_format_and_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["avatar"],
      type: "check",
      where: Sequelize.literal(
        '("avatar" IS NULL OR "avatar" ~ \'^https?://.*\')'
      ),
      name: "check_avatar_url_format",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["password"],
      type: "check",
      where: Sequelize.literal(
        '(char_length("password") >= 8 AND char_length("password") <= 100)'
      ),
      name: "check_password_length",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workers");
  },
};
