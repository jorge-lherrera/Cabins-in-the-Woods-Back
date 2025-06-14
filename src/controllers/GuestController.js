const guestService = require("../services/guestService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class GuestController {
  async getAllGuests(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "name",
        order = "ASC",
        nationality = "all",
      } = req.query;

      const { resource, error, status } = await guestService.getAllGuests({
        page,
        limit,
        orderBy,
        order,
        nationality,
      });

      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Hóspede"),
        resource,
        "guests"
      );
    } catch (error) {
      next(error);
    }
  }
  async getGuestById(req, res, next) {
    try {
      const { id } = req.params;
      const { resource, error, status } = await guestService.getGuestById(id);
      if (error) {
        return res
          .status(status || 404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Hóspede") });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Hóspede"),
        resource,
        "guest"
      );
    } catch (error) {
      next(error);
    }
  }

  async createGuest(req, res, next) {
    try {
      const { fullName, email, nationality, countryFlag, nationalIdNumber } =
        req.body;
      const { resource, error, status } = await guestService.createGuest({
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
        resource,
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
      const { resource, error, status } = await guestService.updateGuest(id, {
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
        resource,
        "guest"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteGuest(req, res, next) {
    try {
      const { id } = req.params;
      const { resource, error, status } = await guestService.deleteGuest(id);
      if (error) {
        return res.status(status || 400).json({ error });
      }

      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Hóspede"),
        resource
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GuestController();
