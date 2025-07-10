const workerService = require("../services/workerService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class WorkerController {
  async getWorkerById(req, res, next) {
    try {
      const id = req.user.id;
      const { resource, error } = await workerService.getWorkerById(id);
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.FOUND("Funcionário"),
        resource,
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }

  async createWorker(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { resource, error } = await workerService.createWorker({
        name,
        email,
        password,
        file: req.file,
      });
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Funcionário"),
        resource,
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateWorker(req, res, next) {
    try {
      const id = req.user.id;
      const { name, email, password, currentPassword } = req.body;
      const { resource, error } = await workerService.updateWorker(id, {
        name,
        email,
        password,
        currentPassword,
        file: req.file,
      });
      if (error) {
        return next(error);
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Funcionário"),
        resource,
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteWorker(req, res, next) {
    try {
      const id = req.user.id;
      const { resource, error } = await workerService.deleteWorker(id);
      if (error) {
        return next(error);
      }

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Funcionário"),
        resource
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
