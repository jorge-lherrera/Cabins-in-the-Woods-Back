const { version } = require("os");

const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Cabins in the Woods API",
    description:
      "API for managing cabins in the woods, project for educational purposes",
    version: "1.0.0",
  },
  host: "localhost:3000",
  security: [{ apiKeyAuth: [] }],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "authorization",
      description: "Token de Autenticação",
    },
  },
};

const outputFile = "./src/routes/swagger.json";
const routes = ["./src/server.js"];

swaggerAutogen(outputFile, routes, doc);
