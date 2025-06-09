const settingService = require("../services/settingService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class SettingController {
  async getSettings(req, res, next) {
    try {
      const { resource, error, status } =
        await settingService.getUniqueSetting();
      if (error) {
        return res
          .status(status || 400)
          .json({ error: MESSAGES.SETTINGS.CONFIG_NOT_FOUND });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Configuração"),
        resource,
        "setting"
      );
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

      const { resource, error, status } =
        await settingService.createUniqueSetting({
          minBookingLength,
          maxBookingLength,
          maxGuestsPerBooking,
          breakfastPrice,
        });

      if (error) {
        return res.status(status || 400).json({ error });
      }

      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Configuração"),
        resource,
        "setting"
      );
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
      const { resource, error, status } =
        await settingService.updateUniqueSetting({
          minBookingLength,
          maxBookingLength,
          maxGuestsPerBooking,
          breakfastPrice,
        });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Configuração"),
        resource,
        "setting"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingController();
