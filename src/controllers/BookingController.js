const MESSAGES = require("../utils/messages");

const bookingService = require("../services/bookingService");
const successResponse = require("../utils/successResponse");

class BookingController {
  async getAllBookingsDashboard(req, res, next) {
    try {
      const { days } = req.query;

      const {
        resource,
        error,
        status: serviceStatus,
      } = await bookingService.getAllBookingsDashboard({
        days,
      });

      if (error) {
        return res.status(serviceStatus || 400).json({ error });
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
      const {
        page = 1,
        limit = 10,
        orderBy = "startDate",
        order = "ASC",
        status,
      } = req.query;

      const parsedLimit = parseInt(limit, 10);
      const offset = (Number(page) - 1) * parsedLimit;
      const where = {};

      if (status) {
        where.status = status.split(",");
      }

      const {
        resource,
        error,
        status: serviceStatus,
      } = await bookingService.getAllBookings({
        where,
        orderBy,
        order,
        limit: parsedLimit,
        offset,
        page: Number(page),
        days,
      });

      if (error) {
        return res.status(serviceStatus || 400).json({ error });
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
        return res.status(status || 404).json({ error });
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
        numNights,
        numGuests,
        extrasPrice,
        hasBreakfast,
        observations,
        isPaid,
        status,
      } = req.body;
      const {
        resource,
        error,
        status: createStatus,
      } = await bookingService.createBooking({
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
        return res.status(createStatus || 400).json({ error });
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
      const {
        resource,
        error,
        status: updateStatus,
      } = await bookingService.updateBooking(id, {
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
        return res.status(updateStatus || 400).json({ error });
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
        return res.status(status || 400).json({ error });
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
