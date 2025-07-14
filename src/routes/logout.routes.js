const { Router } = require("express");
const LogoutController = require("../controllers/LogoutController");
const auth = require("../middleware/auth");
const logoutRoutes = new Router();

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       401:
 *         description: No autorizado
 */
logoutRoutes.post("/", auth, LogoutController.logout);

module.exports = logoutRoutes;
