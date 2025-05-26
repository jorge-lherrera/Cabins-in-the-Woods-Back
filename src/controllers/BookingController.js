const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
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

      const bookings = await Booking.findAndCountAll({
        where,
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
        order: [[orderBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
        limit: parsedLimit,
        offset,
      });

      return res.status(200).json({
        success: true,
        total: bookings.count,
        bookings: bookings.rows,
        page: Number(page),
        limit: parsedLimit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const booking = await Booking.findByPk(id, {
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
      });

      if (!booking) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Reserva") });
      }

      return res.status(200).json({
        success: true,
        booking,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req, res, next) {
    try {
      if (typeof req.body.startDate === "string") {
        req.body.startDate = new Date(req.body.startDate);
      }
      if (typeof req.body.endDate === "string") {
        req.body.endDate = new Date(req.body.endDate);
      }

      await bookingSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

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
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      if (typeof req.body.startDate === "string") {
        req.body.startDate = new Date(req.body.startDate);
      }
      if (typeof req.body.endDate === "string") {
        req.body.endDate = new Date(req.body.endDate);
      }

      await bookingSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

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
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
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
