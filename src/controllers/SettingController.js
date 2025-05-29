const settingService = require("../services/settingService");
const { SETTING_ERRORS } = require("../services/settingService");
const MESSAGES = require("../utils/messages");

class SettingController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingService.getUniqueSetting();
      if (!settings) {
        return res
          .status(404)
          .json({ error: MESSAGES.SETTINGS.CONFIG_NOT_FOUND });
      }
      return res.status(200).json(settings);
    } catch (error) {
      next(error);
    }
  }

  async createSetting(req, res, next) {
    try {
      const {
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
      } = req.body;
      try {
        const setting = await settingService.createUniqueSetting({
          minBookingLength,
          maxBookingLength,
          maxGuestsPerBooking,
          breakfastPrice,
        });
        return res.status(201).json({
          message: MESSAGES.GENERAL.CREATE_SUCCESS("Configuração"),
          setting,
        });
      } catch (err) {
        if (err.message === SETTING_ERRORS.EXISTS) {
          return res
            .status(400)
            .json({ error: MESSAGES.SETTINGS.CONFIG_EXISTS });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req, res, next) {
    try {
      const {
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
      } = req.body;
      try {
        await settingService.updateUniqueSetting({
          minBookingLength,
          maxBookingLength,
          maxGuestsPerBooking,
          breakfastPrice,
        });
        return res.status(200).json({
          message: MESSAGES.GENERAL.UPDATE_SUCCESS("Configuração"),
        });
      } catch (err) {
        if (err.message === settingService.SETTING_ERRORS.NOT_FOUND) {
          return res
            .status(404)
            .json({ error: MESSAGES.SETTINGS.CONFIG_NOT_FOUND });
        }
        throw err;
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingController();
