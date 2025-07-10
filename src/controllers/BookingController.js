const MESSAGES = require("../utils/messages");
const { Op } = require("sequelize");
const bookingService = require("../services/bookingService");
const successResponse = require("../utils/successResponse");

class BookingController {
  async getAllBookingsDashboard(req, res, next) {
    try {
      const { days } = req.query;

      const { resource, error } = await bookingService.getAllBookingsDashboard({
        days,
      });

      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Dashboard de reservas"),
        resource,
        "bookingsDashboard"
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      let { page = 1, limit = 10, orderBy, order, status } = req.query;

      if (!status) status = "all";
      if (!orderBy) orderBy = "startDate";
      if (!order) order = "DESC";

      const parsedLimit = parseInt(limit, 10);
      const offset = (Number(page) - 1) * parsedLimit;
      const where = {};

      if (status) {
        where.status = status.split(",");
      }
      if (where.status && Array.isArray(where.status)) {
        if (where.status.length === 1 && where.status[0] === "all") {
          delete where.status;
        } else {
          where.status = { [Op.in]: where.status };
        }
      }
      const { resource, error } = await bookingService.getAllBookings({
        where,
        orderBy,
        order,
        limit: parsedLimit,
        offset,
        page: Number(page),
      });

      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Reservas"),
        resource,
        "bookings"
      );
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;

      const { resource, error, status } = await bookingService.getBookingById(
        id
      );
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Reserva"),
        resource,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async createBooking(req, res, next) {
    try {
      const {
        cabinId,
        guestId,
        startDate,
        endDate,
        numGuests,
        extrasPrice,
        hasBreakfast,
        observations,
        isPaid,
        status,
      } = req.body;
      const { resource, error } = await bookingService.createBooking({
        cabinId,
        guestId,
        startDate,
        endDate,
        numGuests,
        extrasPrice,
        hasBreakfast,
        observations,
        isPaid,
        status,
      });
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Reserva"),
        resource,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateBooking(req, res, next) {
    try {
      const { id } = req.params;

      const {
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        extrasPrice,
        hasBreakfast,
        observations,
        isPaid,
        status,
      } = req.body;
      const { resource, error } = await bookingService.updateBooking(id, {
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        extrasPrice,
        hasBreakfast,
        observations,
        isPaid,
        status,
      });
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Reserva"),
        resource,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteBooking(req, res, next) {
    try {
      const { id } = req.params;

      const { resource, error, status } = await bookingService.deleteBooking(
        id
      );
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Reserva"),
        resource,
        "booking"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
