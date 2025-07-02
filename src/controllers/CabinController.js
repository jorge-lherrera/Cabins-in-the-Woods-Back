const cabinService = require("../services/cabinService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class CabinController {
  async getAllCabins(req, res, next) {
    try {
      const {
        page = 1,
        limit,
        orderBy = "name",
        order = "ASC",
        discountFilter = "all",
        search = "",
      } = req.query;

      const { resource, error, status } = await cabinService.getAllCabins({
        page,
        limit,
        orderBy,
        order,
        discountFilter,
        search,
      });

      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Cabana"),
        resource,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async getCabinById(req, res, next) {
    try {
      const { id } = req.params;
      const { resource, error, status } = await cabinService.getCabinById(id);
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Cabana"),
        resource,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async createCabin(req, res, next) {
    try {
      const { name, maxCapacity, regularPrice, discount, description } =
        req.body;

      const { resource, error, status } = await cabinService.createCabin({
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        file: req.file,
      });
      if (error) {
        return next(error);
      }

      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Cabana"),
        resource,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async duplicateCabin(req, res, next) {
    try {
      const { id } = req.params;
      const { resource, error, status } = await cabinService.duplicateCabin(id);
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        201,
        MESSAGES.CABIN.DUPLICATE_SUCCESS,
        resource,
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

      const { resource, error, status } = await cabinService.updateCabin(id, {
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        file: req.file,
      });
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Cabana"),
        resource,
        "cabin"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteCabin(req, res, next) {
    try {
      const { id } = req.params;

      const { resource, error, status } = await cabinService.deleteCabin(id);
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Cabana"),
        resource
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CabinController();
