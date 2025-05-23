const Booking = require("../models/Booking");
const Guest = require("../models/Guest");
const MESSAGES = require("../utils/messages");

class GuestController {
  async getGuestById(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const guest = await Guest.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });

      if (!guest) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Hóspede") });
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

      const existingGuest = await Guest.findOne({
        where: {
          email,
          nationalIdNumber,
        },
      });

      if (existingGuest) {
        return res
          .status(409)
          .json({ error: MESSAGES.GUEST.EMAIL_OR_ID_EXISTS });
      }

      const guest = await Guest.create({
        fullName,
        email,
        nationality,
        countryFlag,
        nationalIdNumber,
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Hóspede"),
        guest,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGuest(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingGuest = await Guest.findByPk(id);
      if (!existingGuest) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Hóspede") });
      }

      const { fullName, email, nationality, countryFlag, nationalIdNumber } =
        req.body;

      if (
        existingGuest.email === email ||
        existingGuest.nationalIdNumber === nationalIdNumber
      ) {
        return res
          .status(409)
          .json({ error: MESSAGES.GUEST.EMAIL_OR_ID_EXISTS });
      }

      await Guest.update(
        { fullName, email, nationality, countryFlag, nationalIdNumber },
        { where: { id } }
      );

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Hóspede"),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteGuest(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingGuest = await Guest.findByPk(id);
      if (!existingGuest) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Hóspede") });
      }

      const bookingsCount = await Booking.count({ where: { guestId: id } });
      if (bookingsCount > 0) {
        return res.status(409).json({
          error: MESSAGES.GENERAL.ASSOCIATED_BOOKINGS,
        });
      }

      await Guest.destroy({ where: { id } });

      return res.status(200).json({
        message: MESSAGES.GENERAL.DELETE_SUCCESS("Hóspede"),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GuestController();
