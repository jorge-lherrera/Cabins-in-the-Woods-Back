const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");
const cabinValidation = require("../validations/cabinValidation");

class CabinController {
  async getAllCabins(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const cabins = await Cabin.findAndCountAll({
        include: [{ model: Booking, as: "bookings" }],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        total: cabins.count,
        page: parseInt(page),
        totalPages: Math.ceil(cabins.count / limit),
        data: cabins.rows,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter as cabanas." });
    }
  }

  async getCabinById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const cabin = await Cabin.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });

      if (!cabin) {
        return res.status(404).json({ error: "Cabana não encontrada." });
      }

      res.json(cabin);
    } catch (error) {
      res.status(500).json({ error: "Erro ao obter a cabana." });
    }
  }

  async createCabin(req, res) {
    try {
      await cabinValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, maxCapacity, regularPrice, discount, image, description } =
        req.body;

      const existingCabin = await Cabin.findOne({ where: { name } });

      if (existingCabin) {
        return res.status(409).json({
          message: "O nome da cabana já existe. Por favor, escolha outro.",
        });
      }

      const cabin = await Cabin.create({
        name,
        maxCapacity,
        regularPrice,
        discount,
        image,
        description,
      });

      res.status(201).json({
        message: "Cabana criada com sucesso.",
        cabin,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Erro de validação nos dados fornecidos.",
          detalhes: error.errors,
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          error: "O nome da cabana já existe.",
        });
      }

      console.error("Erro ao cadastrar cabana:", error);
      res.status(500).json({
        error: "Não foi possível efetuar o cadastro da cabana.",
      });
    }
  }

  async updateCabin(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      await cabinValidation.validate(req.body, { abortEarly: false });

      const updated = await Cabin.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Cabana não encontrada." });
      }

      res.json({ message: "Cabana atualizada com sucesso." });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Erro de validação nos dados fornecidos.",
          detalhes: error.errors,
        });
      }
      res.status(500).json({ error: "Erro ao atualizar a cabana." });
    }
  }

  async deleteCabin(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "O ID deve ser um número válido." });
      }

      const deleted = await Cabin.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Cabana não encontrada." });
      }

      res.json({ message: "Cabana excluída com sucesso." });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir a cabana." });
    }
  }
}

module.exports = new CabinController();
