const Setting = require("../models/Setting");
const settingValidation = require("../validations/settingValidation");

const MESSAGES = require("../utils/messages");

class SettingController {
  async getSettings(req, res) {
    try {
      const settings = await Setting.findOne();

      if (!settings) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Configuração") });
      }

      return res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ error: MESSAGES.GENERAL.SERVER_ERROR });
    }
  }

  async createSetting(req, res) {
    try {
      const existingSetting = await Setting.findOne();

      if (existingSetting) {
        return res.status(400).json({ error: MESSAGES.SETTINGS.CONFIG_EXISTS });
      }

      await settingValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { minBookingLength, maxBookingLength, breakfastPrice } = req.body;

      const setting = await Setting.create({
        minBookingLength,
        maxBookingLength,
        breakfastPrice,
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Configuração"),
        setting,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: MESSAGES.GENERAL.VALIDATION_ERROR,
          detalhes: error.errors,
        });
      }
      res
        .status(500)
        .json({ error: MESSAGES.GENERAL.CREATE_ERROR("configuração") });
    }
  }

  async updateSetting(req, res) {
    try {
      const existingSetting = await Setting.findOne();

      if (!existingSetting) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Configuração") });
      }

      await settingValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { minBookingLength, maxBookingLength, breakfastPrice } = req.body;

      await Setting.update(
        {
          minBookingLength,
          maxBookingLength,
          breakfastPrice,
        },
        {
          where: { id: existingSetting.id },
        }
      );

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Configuração"),
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: MESSAGES.GENERAL.VALIDATION_ERROR,
          detalhes: error.errors,
        });
      }
      res
        .status(500)
        .json({ error: MESSAGES.GENERAL.UPDATE_ERROR("configuração") });
    }
  }
}

module.exports = new SettingController();
