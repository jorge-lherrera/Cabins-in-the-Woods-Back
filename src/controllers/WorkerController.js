const workerService = require("../services/workerService");
const MESSAGES = require("../utils/messages");
const successResponse = require("../utils/successResponse");

class WorkerController {
  async getWorkerById(req, res, next) {
    try {
      const { id } = req.params;
      const { worker, error, status } = await workerService.getWorkerById(id);
      if (error) {
        return res.status(status || 404).json({ error });
      }
      return res.status(200).json(worker);
    } catch (error) {
      next(error);
    }
  }

  async createWorker(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const { worker, error, status } = await workerService.createWorker({
        name,
        email,
        password,
        file: req.file,
      });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        201,
        MESSAGES.GENERAL.CREATE_SUCCESS("Funcionário"),
        worker,
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }

  async updateWorker(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, password, currentPassword } = req.body;
      const { success, worker, error, status } =
        await workerService.updateWorker(id, {
          name,
          email,
          password,
          currentPassword,
          file: req.file,
        });
      if (error) {
        return res.status(status || 400).json({ error });
      }
      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.UPDATE_SUCCESS("Funcionário"),
        worker,
        "worker"
      );
    } catch (error) {
      next(error);
    }
  }

  async deleteWorker(req, res, next) {
    try {
      const { id } = req.params;
      const { success, error, status } = await workerService.deleteWorker(id);
      if (error) {
        return res.status(status || 400).json({ error });
      }

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return successResponse(
        res,
        200,
        MESSAGES.GENERAL.DELETE_SUCCESS("Funcionário")
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
