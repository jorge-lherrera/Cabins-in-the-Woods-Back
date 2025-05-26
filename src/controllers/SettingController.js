const BaseController = require("./BaseController");
const settingService = require("../services/settingService");
const MESSAGES = require("../utils/messages");
const Setting = require("../models/Setting");

class SettingController extends BaseController {
  constructor() {
    super(Setting, "Configuração", MESSAGES);
  }

  async getSettings(req, res, next) {
    try {
      const settings = await settingService.getUniqueSetting();
      if (!settings) {
        return res
          .status(404)
          .json({ error: this.messages.SETTINGS.CONFIG_NOT_FOUND });
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
      const setting = await settingService.createUniqueSetting({
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
      });
      return res.status(201).json({
        message: this.messages.GENERAL.CREATE_SUCCESS(this.resourceName),
        setting,
      });
    } catch (error) {
      if (error.message === settingService.SETTING_ERRORS.EXISTS) {
        return res
          .status(409)
          .json({ error: this.messages.SETTINGS.CONFIG_EXISTS });
      }
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

      await settingService.updateUniqueSetting({
        minBookingLength,
        maxBookingLength,
        maxGuestsPerBooking,
        breakfastPrice,
      });
      return res.status(200).json({
        message: this.messages.GENERAL.UPDATE_SUCCESS(this.resourceName),
      });
    } catch (error) {
      if (error.message === settingService.SETTING_ERRORS.NOT_FOUND) {
        return res
          .status(404)
          .json({ error: this.messages.SETTINGS.CONFIG_NOT_FOUND });
      }
      next(error);
    }
  }
}

module.exports = new SettingController();
