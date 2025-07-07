// Seeder for Worker model
"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("workers", [
      {
        name: "Administrador",
        email: "admin@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Funcionário Teste",
        email: "funcionario@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Gerente Silva",
        email: "gerente@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Atendente Ana",
        email: "ana.atendente@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Supervisor João",
        email: "joao.supervisor@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Camila Lima",
        email: "camila.lima@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lucas Ramos",
        email: "lucas.ramos@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Beatriz Souza",
        email: "beatriz.souza@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pedro Martins",
        email: "pedro.martins@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sofia Rocha",
        email: "sofia.rocha@email.com",
        password: await bcrypt.hash("senha123", 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("workers", null, {});
  },
};
