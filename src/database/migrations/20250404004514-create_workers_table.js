"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { INTEGER, STRING, DATE, Op } = Sequelize;

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
      where: {
        name: { [Op.and]: [{ [Op.ne]: "" }, { [Op.lte]: 100 }] },
      },
      name: "check_name_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["email"],
      type: "check",
      where: {
        email: { [Op.lte]: 150 },
      },
      name: "check_email_length",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["email"],
      type: "check",
      where: {
        email: { [Op.regexp]: "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" },
      },
      name: "check_email_format",
    });

    await queryInterface.addConstraint("workers", {
      fields: ["avatar"],
      type: "check",
      where: {
        avatar: {
          [Op.or]: [
            { [Op.is]: null },
            { [Op.regexp]: "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$" },
          ],
        },
      },
      name: "check_avatar_url",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("workers");
  },
};
