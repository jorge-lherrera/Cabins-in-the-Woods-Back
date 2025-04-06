const Guest = require("../models/Guest");
const Booking = require("../models/Booking");

class GuestController {
  async getAllGuests(req, res) {
    try {
      const guests = await Guest.findAll({
        include: [{ model: Booking, as: "bookings" }],
      });
      res.json(guests);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los huéspedes" });
    }
  }

  async getGuestById(req, res) {
    try {
      const { id } = req.params;
      const guest = await Guest.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });
      if (!guest) {
        return res.status(404).json({ error: "Huésped no encontrado" });
      }
      res.json(guest);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el huésped" });
    }
  }

  async createGuest(req, res) {
    try {
      const { fullName, email, nationality, countryFlag, nationalIdNumber } =
        req.body;
      const guest = await Guest.create({
        fullName,
        email,
        nationality,
        countryFlag,
        nationalIdNumber,
      });
      res.status(201).json(guest);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el huésped" });
    }
  }

  async updateGuest(req, res) {
    try {
      const { id } = req.params;
      const updated = await Guest.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Huésped no encontrado" });
      }
      res.json({ message: "Huésped actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el huésped" });
    }
  }

  async deleteGuest(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Guest.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Huésped no encontrado" });
      }
      res.json({ message: "Huésped eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el huésped" });
    }
  }
}

module.exports = new GuestController();
