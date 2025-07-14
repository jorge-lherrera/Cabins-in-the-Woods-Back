const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");
const validate = require("../middleware/validationsYup");
const settingValidation = require("../validations/settingValidation");
const auth = require("../middleware/auth");
const makeAllFieldsOptional = require("../utils/yupUtils");

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Obtiene la configuración general
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Configuración encontrada
 */
settingRoutes.get("/", auth, SettingController.getSettings);

/**
 * @swagger
 * /settings:
 *   post:
 *     summary: Crea la configuración general
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Setting'
 *     responses:
 *       201:
 *         description: Configuración creada
 */
settingRoutes.post(
  "/",
  auth,
  validate(settingValidation),
  SettingController.createSetting
);

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Actualiza la configuración general
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Setting'
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
settingRoutes.put(
  "/",
  auth,
  validate(makeAllFieldsOptional(settingValidation)),
  SettingController.updateSetting
);

module.exports = settingRoutes;
