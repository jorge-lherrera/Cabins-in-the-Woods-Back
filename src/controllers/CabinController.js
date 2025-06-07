const cabinService = require("../services/cabinService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class CabinController {
  async getAllCabins(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        orderBy = "name",
        order = "ASC",
        discountFilter,
      } = req.query;

      const parsedLimit = parseInt(limit);
      const offset = (page - 1) * parsedLimit;

      const allowedOrderFields = {
        name: "name",
        value: "regularPrice",
        guests: "maxCapacity",
      };
      const orderField = allowedOrderFields[orderBy] || "name";
      const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

      const cabins = await cabinService.getAllCabins({
        limit: parsedLimit,
        offset,
        orderField,
        orderDirection,
        discountFilter, // Pasar el filtro al servicio
      });

      return res.status(200).json(cabins);
    } catch (error) {
      next(error);
    }
  }

  async getCabinById(req, res, next) {
    try {
      const { id } = req.params;
      const { cabin, error, status } = await cabinService.getCabinById(id);
      if (error) {
        return res.status(status || 404).json({ error });
      }
      return res.status(200).json(cabin);
    } catch (error) {
      next(error);
    }
  }

  async createCabin(req, res, next) {
    try {
      const result = await cabinService.createCabin({
        ...req.body,
        file: req.file,
      });
      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }
      return successResponse(
        res,
        201,
        MESSAGES.CABIN.CREATE_SUCCESS,
        result.cabin,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async duplicateCabin(req, res, next) {
    try {
      const { id } = req.params;
      const { cabin, error, status } = await cabinService.duplicateCabin(id);
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        201,
        MESSAGES.CABIN.DUPLICATE_SUCCESS,
        cabin,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateCabin(req, res, next) {
    try {
      const { id } = req.params;
      const { name, maxCapacity, regularPrice, discount, description } =
        req.body;

      // Validar que la cabina no tenga bookings asociadas antes de editar
      const hasBookings = await cabinService.hasBookings(id);
      if (hasBookings) {
        return res
          .status(409)
          .json({ error: MESSAGES.GENERAL.ASSOCIATED_BOOKINGS });
      }

      const { success, error, status } = await cabinService.updateCabin(id, {
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        file: req.file,
      });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(res, 200, MESSAGES.CABIN.UPDATE_SUCCESS);
    } catch (error) {
      next(error);
    }
  }

  async deleteCabin(req, res, next) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID("ID") });
      }
      const result = await cabinService.deleteCabin(id);
      if (result.error) {
        return res.status(result.status || 400).json({ error: result.error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.CABIN.DELETE_SUCCESS,
        undefined,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CabinController();
