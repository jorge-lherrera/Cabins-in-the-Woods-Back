const MESSAGES = require("../utils/messages");
const bookingSchema = require("../validations/bookingValidation");
const bookingService = require("../services/bookingService");
const successResponse = require("../utils/successResponse");

class BookingController {
  async getAllBookings(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "startDate",
        order = "ASC",
        cabinId,
        guestId,
        status,
      } = req.query;

      const parsedLimit = parseInt(limit);
      const offset = (page - 1) * parsedLimit;

      const where = {};
      if (cabinId) where.cabinId = cabinId;
      if (guestId) where.guestId = guestId;
      if (status) where.status = status;

      const result = await bookingService.getAllBookingsWithStats({
        where,
        orderBy,
        order,
        limit: parsedLimit,
        offset,
        page: Number(page),
      });

      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Reservas"),
        result,
        "bookings"
      );
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID("ID") });
      }
      const result = await bookingService.getBookingById(id);
      if (result.error) {
        return res.status(result.status || 404).json({ error: result.error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Reserva"),
        result.booking,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req, res, next) {
    try {
      const result = await bookingService.createBooking(req.body);
      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }
      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Reserva"),
        result.booking,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID("ID") });
      }

      const result = await bookingService.updateBooking(id, req.body);
      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Reserva"),
        result.booking,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteBooking(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID("ID") });
      }

      const result = await bookingService.deleteBooking(id);
      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Reserva")
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
