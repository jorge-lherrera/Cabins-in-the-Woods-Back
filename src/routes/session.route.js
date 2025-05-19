const { Router } = require("express");
const SessionController = require("../controllers/SessionController");
const sessionRoutes = new Router();

sessionRoutes.get("/", SessionController.getSession);

module.exports = sessionRoutes;
