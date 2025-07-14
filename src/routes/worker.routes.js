const { Router } = require("express");
const workerRoutes = new Router();
const WorkerController = require("../controllers/WorkerController");
const validate = require("../middleware/validationsYup");
const workerValidation = require("../validations/workerValidation");
const auth = require("../middleware/auth");
const makeAllFieldsOptional = require("../utils/yupUtils");
const upload = require("../middleware/upload");

/**
 * @swagger
 * /workers/me:
 *   get:
 *     summary: Obtiene el perfil del trabajador autenticado
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Perfil encontrado
 *       401:
 *         description: No autorizado
 */
workerRoutes.get("/me", auth, WorkerController.getWorkerById);

/**
 * @swagger
 * /workers:
 *   post:
 *     summary: Crea un nuevo trabajador
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/Worker'
 *     responses:
 *       201:
 *         description: Trabajador creado
 */
workerRoutes.post(
  "/",
  upload.single("file"),
  validate(workerValidation),
  WorkerController.createWorker
);

/**
 * @swagger
 * /workers/me:
 *   put:
 *     summary: Actualiza el perfil del trabajador autenticado
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/Worker'
 *     responses:
 *       200:
 *         description: Perfil actualizado
 */
workerRoutes.put(
  "/me",
  auth,
  upload.single("file"),
  validate(makeAllFieldsOptional(workerValidation)),
  WorkerController.updateWorker
);

/**
 * @swagger
 * /workers/me:
 *   delete:
 *     summary: Elimina el perfil del trabajador autenticado
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       204:
 *         description: Perfil eliminado
 */
workerRoutes.delete("/me", auth, WorkerController.deleteWorker);

module.exports = workerRoutes;
