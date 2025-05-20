const { Router } = require("express");
const LogoutController = require("../controllers/LogoutController");
const auth = require("../middleware/auth");
const logoutRoutes = new Router();

logoutRoutes.post("/", auth, LogoutController.logout);

module.exports = logoutRoutes;
