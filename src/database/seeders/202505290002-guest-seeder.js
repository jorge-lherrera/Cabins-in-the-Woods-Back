// Seeder for Guest model
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("guests", [
      {
        fullName: "João Silva",
        email: "joao.silva@email.com",
        nationality: "Brasileiro",
        countryFlag: "https://example.com/flags/br.png",
        nationalIdNumber: "123456789",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        nationality: "Portuguesa",
        countryFlag: "https://example.com/flags/pt.png",
        nationalIdNumber: "987654321",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Carlos Souza",
        email: "carlos.souza@email.com",
        nationality: "Brasileiro",
        countryFlag: "https://example.com/flags/br.png",
        nationalIdNumber: "111222333",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Ana Costa",
        email: "ana.costa@email.com",
        nationality: "Portuguesa",
        countryFlag: "https://example.com/flags/pt.png",
        nationalIdNumber: "444555666",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Pedro Lima",
        email: "pedro.lima@email.com",
        nationality: "Brasileiro",
        countryFlag: "https://example.com/flags/br.png",
        nationalIdNumber: "777888999",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Beatriz Ramos",
        email: "beatriz.ramos@email.com",
        nationality: "Portuguesa",
        countryFlag: "https://example.com/flags/pt.png",
        nationalIdNumber: "222333444",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Lucas Martins",
        email: "lucas.martins@email.com",
        nationality: "Brasileiro",
        countryFlag: "https://example.com/flags/br.png",
        nationalIdNumber: "555666777",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Sofia Almeida",
        email: "sofia.almeida@email.com",
        nationality: "Portuguesa",
        countryFlag: "https://example.com/flags/pt.png",
        nationalIdNumber: "888999000",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Rafael Rocha",
        email: "rafael.rocha@email.com",
        nationality: "Brasileiro",
        countryFlag: "https://example.com/flags/br.png",
        nationalIdNumber: "333444555",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullName: "Camila Pinto",
        email: "camila.pinto@email.com",
        nationality: "Portuguesa",
        countryFlag: "https://example.com/flags/pt.png",
        nationalIdNumber: "666777888",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("guests", null, {});
  },
};
