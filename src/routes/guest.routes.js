const { Router } = require("express");
const guestRoutes = new Router();
const GuestController = require("../controllers/GuestController");
const validate = require("../middleware/validationsYup");
const guestValidation = require("../validations/guestValidation");
const auth = require("../middleware/auth");
const makeAllFieldsOptional = require("../utils/yupUtils");

/**
 * @swagger
 * /guests:
 *   get:
 *     summary: Obtiene todos los huéspedes
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de huéspedes
 */
guestRoutes.get("/", auth, GuestController.getAllGuests);

/**
 * @swagger
 * /guests/{id}:
 *   get:
 *     summary: Obtiene un huésped por ID
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Huésped encontrado
 */
guestRoutes.get("/:id", auth, GuestController.getGuestById);

/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Crea un nuevo huésped
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Guest'
 *     responses:
 *       201:
 *         description: Huésped creado
 */
guestRoutes.post(
  "/",
  auth,
  validate(guestValidation),
  GuestController.createGuest
);

/**
 * @swagger
 * /guests/{id}:
 *   put:
 *     summary: Actualiza un huésped existente
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Guest'
 *     responses:
 *       200:
 *         description: Huésped actualizado
 */
guestRoutes.put(
  "/:id",
  auth,
  validate(makeAllFieldsOptional(guestValidation)),
  GuestController.updateGuest
);

/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Elimina un huésped
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Huésped eliminado
 */
guestRoutes.delete("/:id", auth, GuestController.deleteGuest);

module.exports = guestRoutes;
