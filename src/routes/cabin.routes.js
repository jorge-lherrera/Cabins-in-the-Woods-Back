const { Router } = require("express");
const cabinRoutes = new Router();
const CabinController = require("../controllers/CabinController");
const validate = require("../middleware/validationsYup");
const cabinValidation = require("../validations/cabinValidation");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const makeAllFieldsOptional = require("../utils/yupUtils");
const normalizeNumericFields = require("../middleware/normalizeNumericFields");

/**
 * @swagger
 * /cabins:
 *   get:
 *     summary: Obtiene todas las cabañas
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de cabañas
 */
cabinRoutes.get("/", auth, CabinController.getAllCabins);

/**
 * @swagger
 * /cabins/{id}:
 *   get:
 *     summary: Obtiene una cabaña por ID
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
 *         description: Cabaña encontrada
 */
cabinRoutes.get("/:id", auth, CabinController.getCabinById);

/**
 * @swagger
 * /cabins:
 *   post:
 *     summary: Crea una nueva cabaña
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/Cabin'
 *     responses:
 *       201:
 *         description: Cabaña creada
 */
cabinRoutes.post(
  "/",
  auth,
  upload.single("file"),
  normalizeNumericFields(["maxCapacity", "regularPrice", "discount"]),
  validate(cabinValidation),
  CabinController.createCabin
);

/**
 * @swagger
 * /cabins/{id}/duplicate:
 *   post:
 *     summary: Duplica una cabaña existente
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
 *             $ref: '#/definitions/Cabin'
 *     responses:
 *       201:
 *         description: Cabaña duplicada
 */
cabinRoutes.post(
  "/:id/duplicate",
  auth,
  normalizeNumericFields(["maxCapacity", "regularPrice", "discount"]),
  validate(cabinValidation),
  CabinController.duplicateCabin
);

/**
 * @swagger
 * /cabins/{id}:
 *   put:
 *     summary: Actualiza una cabaña existente
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
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/definitions/Cabin'
 *     responses:
 *       200:
 *         description: Cabaña actualizada
 */
cabinRoutes.put(
  "/:id",
  auth,
  upload.single("file"),
  normalizeNumericFields(["maxCapacity", "regularPrice", "discount"]),
  validate(makeAllFieldsOptional(cabinValidation)),
  CabinController.updateCabin
);

/**
 * @swagger
 * /cabins/{id}:
 *   delete:
 *     summary: Elimina una cabaña
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
 *         description: Cabaña eliminada
 */
cabinRoutes.delete("/:id", auth, CabinController.deleteCabin);

module.exports = cabinRoutes;
