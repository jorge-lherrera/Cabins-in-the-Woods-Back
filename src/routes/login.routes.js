const { Router } = require("express");
const LoginController = require("../controllers/LoginController");
const validate = require("../middleware/validationsYup");
const { loginValidation } = require("../validations/loginValidation");
const loginRoutes = new Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Inicia sesión y obtiene un token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token
 *       401:
 *         description: Credenciales inválidas
 */
loginRoutes.post("/", validate(loginValidation), LoginController.login);

module.exports = loginRoutes;
