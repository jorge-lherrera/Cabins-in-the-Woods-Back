const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");

const MESSAGES = require("../utils/messages");
const { Op } = require("sequelize");

const bookingSchema = require("../validations/bookingValidation");

class BookingController {
  async getAllBookings(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const parsedLimit = parseInt(limit);
      const offset = (page - 1) * parsedLimit;

      let where = {};
      if (filter) {
        const parsedFilter =
          typeof filter === "string" ? JSON.parse(filter) : filter;
        if (
          parsedFilter &&
          parsedFilter.field &&
          parsedFilter.value !== undefined
        ) {
          where[parsedFilter.field] = parsedFilter.value;
        }
      }

      let order = [];
      if (sortBy) {
        const parsedSort =
          typeof sortBy === "string" ? JSON.parse(sortBy) : sortBy;
        if (parsedSort && parsedSort.field && parsedSort.direction) {
          order.push([parsedSort.field, parsedSort.direction.toUpperCase()]);
        }
      } else {
        order.push(["startDate", "DESC"]);
      }

      const bookings = await Booking.findAndCountAll({
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
        limit: parsedLimit,
        offset: offset,
      });

      return res.status(200).json({
        count: bookings.count,
        page: parseInt(page),
        totalPages: Math.ceil(bookings.count / parsedLimit),
        data: bookings.rows,
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

      return res.status(200).json(booking);
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

      const {
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations,
        isPaid,
      } = req.body;

      const cabin = await Cabin.findByPk(cabinId);
      const guest = await Guest.findByPk(guestId);

      if (!cabin || !guest) {
        return res.status(409).json({
          error: MESSAGES.GENERAL.NOT_FOUND(!cabin ? "Cabana" : "Hóspede"),
        });
      }

      const overlappingBooking = await Booking.findOne({
        where: {
          cabinId,
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } },
              ],
            },
          ],
        },
      });

      if (overlappingBooking) {
        return res.status(409).json({
          error: MESSAGES.BOOKING.DUPLICATE_BOOKING,
        });
      }

      const booking = await Booking.create({
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations,
        isPaid,
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Reserva"),
        booking,
      });
    } catch (error) {
      next(error);
    }
  }
  async getStaysAfterDate(req, res, next) {
    try {
      const { date } = req.query;
      if (!date || isNaN(new Date(date))) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_DATE });
      }

      const stays = await Booking.findAll({
        where: {
          startDate: {
            [Op.gte]: new Date(date),
            [Op.lte]: new Date(),
          },
        },
        include: [{ model: Guest, as: "guest", attributes: ["fullName"] }],
        order: [["startDate", "ASC"]],
      });

      return res.status(200).json(stays);
    } catch (error) {
      next(error);
    }
  }
  async getBookingsAfterDate(req, res, next) {
    try {
      const { date } = req.query;
      if (!date || isNaN(new Date(date))) {
        return res
          .status(400)
          .json({ error: MESSAGES.GENERAL.INVALID_DATE || "Data inválida" });
      }

      const bookings = await Booking.findAll({
        where: {
          created_at: {
            [Op.gte]: new Date(date),
            [Op.lte]: new Date(), // Hasta hoy
          },
        },
        attributes: ["created_at", "totalPrice", "extrasPrice"],
        order: [["created_at", "ASC"]],
      });

      return res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  }
  async getStaysTodayActivity(req, res, next) {
    try {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      const bookings = await Booking.findAll({
        where: {
          [Op.or]: [
            { status: "unconfirmed", startDate: today },
            { status: "checked-in", endDate: today },
          ],
        },
        include: [
          {
            model: Guest,
            attributes: ["fullName", "nationality", "countryFlag"],
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      res.json(bookings);
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

      const existingBooking = await Booking.findByPk(id);
      if (!existingBooking) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Reserva") });
      }
      if (typeof req.body.startDate === "string") {
        req.body.startDate = new Date(req.body.startDate);
      }
      if (typeof req.body.endDate === "string") {
        req.body.endDate = new Date(req.body.endDate);
      }

      const {
        cabinId,
        guestId,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations,
        isPaid,
      } = req.body;

      const datesChanged =
        existingBooking.startDate.getTime() !== new Date(startDate).getTime() ||
        existingBooking.endDate.getTime() !== new Date(endDate).getTime();

      if (datesChanged) {
        const overlappingBooking = await Booking.findOne({
          where: {
            cabinId,
            id: { [Op.ne]: id },
            [Op.or]: [
              {
                startDate: {
                  [Op.between]: [startDate, endDate],
                },
              },
              {
                endDate: {
                  [Op.between]: [startDate, endDate],
                },
              },
              {
                [Op.and]: [
                  { startDate: { [Op.lte]: startDate } },
                  { endDate: { [Op.gte]: endDate } },
                ],
              },
            ],
          },
        });

        if (overlappingBooking) {
          return res.status(409).json({
            error: MESSAGES.BOOKING.DUPLICATE_BOOKING,
          });
        }
      }
      await Booking.update(
        {
          cabinId,
          guestId,
          startDate,
          endDate,
          numNights,
          numGuests,
          cabinPrice,
          extrasPrice,
          totalPrice,
          hasBreakfast,
          observations,
          isPaid,
        },
        { where: { id } }
      );

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Reserva"),
      });
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

      const existingBooking = await Booking.findByPk(id);
      if (!existingBooking) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Reserva") });
      }

      await Booking.destroy({ where: { id } });
      return res.status(200).json({
        message: MESSAGES.GENERAL.DELETE_SUCCESS("Reserva"),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
