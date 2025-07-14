const { Router } = require("express");
const SessionController = require("../controllers/SessionController");
const auth = require("../middleware/auth");
const sessionRoutes = new Router();

/**
 * @swagger
 * /session:
 *   get:
 *     summary: Obtiene la sesión del usuario autenticado
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Sesión encontrada
 *       401:
 *         description: No autorizado
 */
sessionRoutes.get("/", auth, SessionController.getSession);

module.exports = sessionRoutes;
