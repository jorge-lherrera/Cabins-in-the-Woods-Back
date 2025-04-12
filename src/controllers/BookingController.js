const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const bookingValidation = require("../validations/bookingValidation");

class BookingController {
  async getAllBookings(req, res) {
    try {
      const bookings = await Booking.findAll({
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
      });
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter as reservas." });
    }
  }

  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const booking = await Booking.findByPk(id, {
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
      });

      if (!booking) {
        return res.status(404).json({ error: "Reserva não encontrada." });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter a reserva." });
    }
  }

  async createBooking(req, res) {
    try {
      await bookingValidation.validate(req.body, { abortEarly: false });

      const { cabinId, guestId, ...data } = req.body;

      const cabin = await Cabin.findByPk(cabinId);
      const guest = await Guest.findByPk(guestId);
      if (!cabin || !guest) {
        return res.status(400).json({ error: "Cabana ou hóspede inválido." });
      }

      const booking = await Booking.create({ cabinId, guestId, ...data });
      res.status(201).json(booking);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ errors: error.errors });
      }
      console.log(error);
      res.status(500).json({ error: "Erro ao criar a reserva." });
    }
  }

  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      await bookingValidation.validate(req.body, { abortEarly: false });

      const updated = await Booking.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Reserva não encontrada." });
      }

      res.json({ message: "Reserva atualizada com sucesso." });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Erro ao atualizar a reserva." });
    }
  }

  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const deleted = await Booking.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Reserva não encontrada." });
      }

      res.json({ message: "Reserva excluída com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir a reserva." });
    }
  }
}

module.exports = new BookingController();
