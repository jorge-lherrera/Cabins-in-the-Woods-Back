const guestService = require("../services/guestService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class GuestController {
  async getGuestById(req, res, next) {
    try {
      const { id } = req.params;
      const { guest, error, status } = await guestService.getGuestById(id);
      if (error) {
        return res.status(status || 404).json({ error });
      }
      return res.status(200).json(guest);
    } catch (error) {
      next(error);
    }
  }

  async createGuest(req, res, next) {
    try {
      const { fullName, email, nationality, countryFlag, nationalIdNumber } =
        req.body;
      const { guest, error, status } = await guestService.createGuest({
        fullName,
        email,
        nationality,
        countryFlag,
        nationalIdNumber,
      });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Hóspede"),
        guest,
        "guest"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateGuest(req, res, next) {
    try {
      const { id } = req.params;
      const { fullName, email, nationality, countryFlag, nationalIdNumber } =
        req.body;
      const { guest, error, status } = await guestService.updateGuest(id, {
        fullName,
        email,
        nationality,
        countryFlag,
        nationalIdNumber,
      });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Hóspede"),
        guest,
        "guest"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteGuest(req, res, next) {
    try {
      const { id } = req.params;

      const hasBookings = await guestService.hasBookings(id);
      if (hasBookings) {
        return res
          .status(409)
          .json({ error: MESSAGES.GENERAL.ASSOCIATED_BOOKINGS });
      }

      const { success, error, status } = await guestService.deleteGuest(id);
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Hóspede")
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GuestController();
