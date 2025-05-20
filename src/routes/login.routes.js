const { Router } = require("express");
const LoginController = require("../controllers/LoginController");
const validate = require("../middleware/validationsYup");
const { loginValidation } = require("../validations/loginValidation");
const loginRoutes = new Router();

loginRoutes.post("/", validate(loginValidation), LoginController.login);

module.exports = loginRoutes;
