const Setting = require("../models/Setting");
const settingValidation = require("../validations/settingValidation");
const MESSAGES = require("../utils/messages");

class SettingController {
  async getAllSettings(req, res) {
    try {
      const settings = await Setting.findAll();
      res.json(settings);
    } catch (error) {
      return res.status(500).json({ error: MESSAGES.GENERAL.SERVER_ERROR });
    }
  }

  async createSetting(req, res) {
    try {
      await settingValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const setting = await Setting.create(req.body);
      res.status(201).json(setting);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Errores de validación en los datos proporcionados.",
          detalles: error.errors,
        });
      }
      return res
        .status(500)
        .json({ error: MESSAGES.GENERAL.CREATE_ERROR("Configuração") });
    }
  }

  async updateSetting(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "El ID debe ser un número válido." });
      }

      await settingValidation.validate(req.body, { abortEarly: false });

      const updated = await Setting.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Configuración no encontrada" });
      }

      res.json({ message: "Configuración actualizada correctamente" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Errores de validación en los datos proporcionados.",
          detalles: error.errors,
        });
      }
      return res
        .status(500)
        .json({ error: MESSAGES.GENERAL.UPDATE_ERROR("Configuração") });
    }
  }
}

module.exports = new SettingController();
