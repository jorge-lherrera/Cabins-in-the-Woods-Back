const findById = require("../utils/findById");
const successResponse = require("../utils/successResponse");

class BaseController {
  constructor(model, resourceName, messages) {
    this.model = model;
    this.resourceName = resourceName;
    this.messages = messages;
  }

  async getAll(req, res, next) {
    try {
      const items = await this.model.findAll();
      return res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const item = await findById(this.model, id);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: this.messages.GENERAL.NOT_FOUND(this.resourceName),
        });
      }
      return res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const item = await this.model.create(req.body);
      return successResponse(
        res,
        201,
        this.messages.GENERAL.CREATE_SUCCESS(this.resourceName),
        item,
        this.resourceName.toLowerCase()
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await findById(this.model, id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: this.messages.GENERAL.NOT_FOUND(this.resourceName),
        });
      }
      await this.model.update(req.body, { where: { id } });
      return successResponse(
        res,
        200,
        this.messages.GENERAL.UPDATE_SUCCESS(this.resourceName)
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const existing = await findById(this.model, id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: this.messages.GENERAL.NOT_FOUND(this.resourceName),
        });
      }
      await this.model.destroy({ where: { id } });
      return successResponse(
        res,
        200,
        this.messages.GENERAL.DELETE_SUCCESS(this.resourceName)
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BaseController;
