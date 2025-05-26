const { Router } = require("express");
const SessionController = require("../controllers/SessionController");
const auth = require("../middleware/auth");
const sessionRoutes = new Router();

sessionRoutes.get("/", auth, SessionController.getSession);

module.exports = sessionRoutes;
