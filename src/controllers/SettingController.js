const Setting = require("../models/Setting");
const settingValidation = require("../validations/settingValidation");
const MESSAGES = require("../utils/messages");

class SettingController {
  async getSettings(req, res, next) {
    try {
      const settings = await Setting.findOne();

      if (!settings) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Configuração") });
      }

      return res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async createSetting(req, res, next) {
    try {
      await settingValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { minBookingLength, maxBookingLength, breakfastPrice } = req.body;

      const existingSetting = await Setting.findOne();

      if (existingSetting) {
        return res.status(409).json({ error: MESSAGES.SETTINGS.CONFIG_EXISTS });
      }

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
      next(error);
    }
  }

  async updateSetting(req, res, next) {
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
      next(error);
    }
  }
}

module.exports = new SettingController();
