"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE } = Sequelize;

    await queryInterface.createTable("guests", {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fullName: {
        type: STRING(100),
        allowNull: false,
      },
      email: {
        type: STRING(150),
        allowNull: false,
        unique: true,
      },
      nationality: {
        type: STRING(50),
        allowNull: false,
      },
      countryFlag: {
        type: STRING,
        allowNull: true,
      },
      nationalIdNumber: {
        type: STRING(20),
        allowNull: false,
        unique: true,
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

    await queryInterface.addConstraint("guests", {
      fields: ["fullName"],
      type: "check",
      where: Sequelize.literal('char_length("fullName") BETWEEN 3 AND 100'),
      name: "check_fullName_length",
    });

    await queryInterface.addConstraint("guests", {
      fields: ["email"],
      type: "check",
      where: Sequelize.literal('char_length("email") <= 150'),
      name: "check_email_length",
    });

    await queryInterface.addConstraint("guests", {
      fields: ["email"],
      type: "check",
      where: Sequelize.literal("\"email\" ~ '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'"),
      name: "check_email_format",
    });

    await queryInterface.addConstraint("guests", {
      fields: ["nationality"],
      type: "check",
      where: Sequelize.literal('char_length("nationality") BETWEEN 2 AND 50'),
      name: "check_nationality_length",
    });

    await queryInterface.addConstraint("guests", {
      fields: ["countryFlag"],
      type: "check",
      where: Sequelize.literal(
        '("countryFlag" IS NULL OR "countryFlag" ~ \'^https?://\')'
      ),
      name: "check_countryFlag_url",
    });

    await queryInterface.addConstraint("guests", {
      fields: ["nationalIdNumber"],
      type: "check",
      where: Sequelize.literal(
        'char_length("nationalIdNumber") BETWEEN 5 AND 20'
      ),
      name: "check_nationalIdNumber_length",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("guests");
  },
};
