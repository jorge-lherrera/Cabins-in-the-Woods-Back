const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const workerValidation = require("../validations/workerValidation");
const MESSAGES = require("../utils/messages");

class WorkerController {
  async getWorkerById(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const worker = await Worker.findByPk(id);

      if (!worker) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionarío") });
      }

      return res.status(200).json(worker);
    } catch (error) {
      next(error);
    }
  }

  async createWorker(req, res, next) {
    try {
      await workerValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, email, avatar, password } = req.body;

      const existingWorker = await Worker.findOne({
        where: { email },
      });

      if (existingWorker) {
        return res.status(409).json({ error: MESSAGES.WORKER.EMAIL_IN_USE });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const worker = await Worker.create({
        name,
        email,
        avatar,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Funcionarío"),
        worker,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateWorker(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingWorker = await Worker.findByPk(id);

      if (!existingWorker) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionarío") });
      }

      await workerValidation.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, email, avatar, password, currentPassword } = req.body;

      if (password && currentPassword) {
        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          existingWorker.password
        );

        if (!isPasswordCorrect) {
          return res
            .status(401)
            .json({ error: MESSAGES.WORKER.INVALID_CURRENT_PASSWORD });
        }
      } else if (password && !currentPassword) {
        return res
          .status(400)
          .json({ error: MESSAGES.WORKER.CURRENT_PASSWORD_REQUIRED });
      }
      const updatedData = {
        name,
        email,
        avatar,
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      await Worker.update(updatedData, { where: { id } });

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Funcionarío"),
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteWorker(req, res, next) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const existingWorker = await Worker.findByPk(id);

      if (!existingWorker) {
        return res
          .status(404)
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionarío") });
      }

      await Worker.destroy({ where: { id } });

      return res.status(200).json({
        message: MESSAGES.GENERAL.DELETE_SUCCESS("Funcionarío"),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
