const { Op } = require("sequelize");
const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");

const MESSAGES = require("../utils/messages");

class CabinController {
  async getAllCabins(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "name",
        order = "ASC",
      } = req.query;
      const parsedLimit = parseInt(limit);
      const offset = (page - 1) * parsedLimit;

      // Validar campos permitidos para ordenar
      const allowedOrderFields = {
        name: "name",
        value: "regularPrice",
        guests: "maxCapacity",
      };
      const orderField = allowedOrderFields[orderBy] || "name";
      const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

      const cabins = await Cabin.findAndCountAll({
        include: [{ model: Booking, as: "bookings" }],
        limit: parsedLimit,
        offset: offset,
        order: [[orderField, orderDirection]],
      });

      return res.status(200).json({
        total: cabins.count,
        page: parseInt(page),
        totalPages: Math.ceil(cabins.count / parsedLimit),
        data: cabins.rows,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCabinById(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const cabin = await Cabin.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });

      if (!cabin) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Cabana") });
      }

      return res.status(200).json(cabin);
    } catch (error) {
      next(error);
    }
  }

  async createCabin(req, res, next) {
    try {
      const { name, maxCapacity, regularPrice, discount, image, description } =
        req.body;

      const existingCabin = await Cabin.findOne({ where: { name } });

      if (existingCabin) {
        return res.status(409).json({
          error: MESSAGES.CABIN.NAME_EXISTS,
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

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Cabana"),
        cabin,
      });
    } catch (error) {
      next(error);
    }
  }

  async duplicateCabin(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      const cabin = await Cabin.findByPk(id);
      if (!cabin) {
        return res.status(404).json({ error: "Cabana não encontrada." });
      }

      const newName = `${cabin.name} (Cópia)`;
      const nameExists = await Cabin.findOne({ where: { name: newName } });
      if (nameExists) {
        return res.status(409).json({
          error: "Já existe uma cabana duplicada com esse nome.",
        });
      }

      const duplicatedCabin = await Cabin.create({
        name: newName,
        maxCapacity: cabin.maxCapacity,
        regularPrice: cabin.regularPrice,
        discount: cabin.discount,
        image: cabin.image,
        description: cabin.description,
      });

      return res.status(201).json({
        message: "Cabana duplicada com sucesso.",
        cabin: duplicatedCabin,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCabin(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingCabin = await Cabin.findByPk(id);
      if (!existingCabin) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Cabana") });
      }

      const { name, maxCapacity, regularPrice, discount, image, description } =
        req.body;

      const nameConflict = await Cabin.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });

      if (nameConflict) {
        return res.status(409).json({
          error: MESSAGES.CABIN.NAME_EXISTS,
        });
      }

      await Cabin.update(
        {
          name,
          maxCapacity,
          regularPrice,
          discount,
          image,
          description,
        },
        { where: { id } }
      );

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Cabana"),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCabin(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingCabin = await Cabin.findByPk(id);
      if (!existingCabin) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Cabana") });
      }
      const bookingsCount = await Booking.count({ where: { guestId: id } });
      if (bookingsCount > 0) {
        return res.status(409).json({
          error:
            "No se puede eliminar la cabana porque tiene reservas asociadas.",
        });
      }
      await Cabin.destroy({ where: { id } });

      return res
        .status(200)
        .json({ message: MESSAGES.GENERAL.DELETE_SUCCESS("Cabana") });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CabinController();
