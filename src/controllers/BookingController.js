const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");

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
      res.status(500).json({ error: "Error al obtener las reservas" });
    }
  }

  async getBookingById(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id, {
        include: [
          { model: Cabin, as: "cabin" },
          { model: Guest, as: "guest" },
        ],
      });
      if (!booking) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la reserva" });
    }
  }

  async createBooking(req, res) {
    try {
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

      // Verificar si la cabaña y el huésped existen
      const cabin = await Cabin.findByPk(cabinId);
      const guest = await Guest.findByPk(guestId);
      if (!cabin || !guest) {
        return res.status(400).json({ error: "Cabaña o huésped no válido" });
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
      res.status(201).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la reserva" });
    }
  }

  async updateBooking(req, res) {
    try {
      const { id } = req.params;
      const updated = await Booking.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json({ message: "Reserva actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la reserva" });
    }
  }

  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Booking.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Reserva no encontrada" });
      }
      res.json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la reserva" });
    }
  }
}

module.exports = new BookingController();
