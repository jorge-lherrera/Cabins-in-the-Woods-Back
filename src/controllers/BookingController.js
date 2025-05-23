const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const MESSAGES = require("../utils/messages");
const { Op } = require("sequelize");
const bookingSchema = require("../validations/bookingValidation");

class BookingController {
  async getAllBookings(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        filter,
        sortBy,
        startDateFrom,
        startDateTo,
        createdAtFrom,
        createdAtTo,
        status,
        staysAfterDate,
        staysTodayActivity,
      } = req.query;

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

      if (startDateFrom || startDateTo) {
        where.startDate = {};
        if (startDateFrom) where.startDate[Op.gte] = new Date(startDateFrom);
        if (startDateTo) where.startDate[Op.lte] = new Date(startDateTo);
      }

      if (createdAtFrom || createdAtTo) {
        where.createdAt = {};
        if (createdAtFrom) where.createdAt[Op.gte] = new Date(createdAtFrom);
        if (createdAtTo) where.createdAt[Op.lte] = new Date(createdAtTo);
      }

      if (status) {
        where.status = status;
      }

      if (staysAfterDate) {
        const date = new Date(staysAfterDate);
        if (isNaN(date)) {
          return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_DATE });
        }
        where.startDate = { [Op.gte]: date, [Op.lte]: new Date() };
      }

      if (staysTodayActivity === "true") {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        where[Op.or] = [
          {
            status: "unconfirmed",
            startDate: {
              [Op.between]: [todayStart, todayEnd],
            },
          },
          {
            status: "checked-in",
            endDate: {
              [Op.between]: [todayStart, todayEnd],
            },
          },
        ];
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

      const include = [
        { model: Cabin, as: "cabin" },
        { model: Guest, as: "guest" },
      ];

      if (staysAfterDate) {
        include[1].attributes = ["fullName"];
      }
      if (staysTodayActivity === "true") {
        include[1].attributes = ["fullName", "nationality", "countryFlag"];
      }

      const bookings = await Booking.findAndCountAll({
        where,
        include,
        limit: parsedLimit,
        offset: offset,
        order,
      });

      if (
        (staysAfterDate && (!bookings.rows || bookings.rows.length === 0)) ||
        (staysTodayActivity === "true" &&
          (!bookings.rows || bookings.rows.length === 0))
      ) {
        return res.status(404).json({
          message:
            staysAfterDate === undefined
              ? MESSAGES.GENERAL.NO_BOOKINGS_FOUND
              : MESSAGES.GENERAL.NO_STAYS_FOUND,
        });
      }

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
          error: !cabin
            ? MESSAGES.GENERAL.NOT_FOUND("Cabana")
            : MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
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
        status: "unconfirmed",
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Reserva"),
        booking,
      });
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
        status,
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
          status: status || existingBooking.status,
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
