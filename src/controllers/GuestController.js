const Guest = require("../models/Guest");
const Booking = require("../models/Booking");
const guestValidation = require("../validations/guestValidation");

class GuestController {
  async getAllGuests(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const guests = await Guest.findAndCountAll({
        include: [{ model: Booking, as: "bookings" }],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        total: guests.count,
        page: parseInt(page),
        totalPages: Math.ceil(guests.count / limit),
        data: guests.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter os hóspedes." });
    }
  }

  async getGuestById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const guest = await Guest.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });

      if (!guest) {
        return res.status(404).json({ error: "Hóspede não encontrado." });
      }

      res.json(guest);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter o hóspede." });
    }
  }

  async createGuest(req, res) {
    try {
      await guestValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const guest = await Guest.create(req.body);
      res.status(201).json(guest);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Erro de validação nos dados fornecidos.",
          detalhes: error.errors,
        });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "O e-mail ou número de identificação já existe." });
      }
      res.status(500).json({ error: "Erro ao criar o hóspede." });
    }
  }

  async updateGuest(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      await guestValidation.validate(req.body, { abortEarly: false });

      const updated = await Guest.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Hóspede não encontrado." });
      }

      res.json({ message: "Hóspede atualizado com sucesso." });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Erro de validação nos dados fornecidos.",
          detalhes: error.errors,
        });
      }
      res.status(500).json({ error: "Erro ao atualizar o hóspede." });
    }
  }

  async deleteGuest(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const deleted = await Guest.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Hóspede não encontrado." });
      }

      res.json({ message: "Hóspede excluído com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir o hóspede." });
    }
  }
}

module.exports = new GuestController();
