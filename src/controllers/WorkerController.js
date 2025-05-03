const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const workerValidation = require("../validations/workerValidation");
const MESSAGES = require("../utils/messages");

class WorkerController {
  async getWorkerById(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const worker = await Worker.findByPk(id);

      if (!worker) {
        return res.status(404).json({ error: "Funcionarío não encontrado." });
      }

      return res.status(200).json(worker);
    } catch (error) {
      return res.status(500).json({ error: MESSAGES.GENERAL.SERVER_ERROR });
    }
  }

  async createWorker(req, res) {
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
        return res.status(409).json({
          error: MESSAGES.WORKER.EMAIL_IN_USE,
        });
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
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: MESSAGES.GENERAL.VALIDATION_ERROR,
          detalhes: error.errors,
        });
      }
      return res
        .status(500)
        .json({ error: MESSAGES.GENERAL.CREATE_ERROR("Funcionarío") });
    }
  }

  async updateWorker(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      await workerValidation.validate(req.body, { abortEarly: false });

      const updated = await Worker.update(req.body, { where: { id } });

      if (!updated[0]) {
        return res.status(404).json({ error: "Funcionarío não encontrado." });
      }

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Funcionarío"),
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: MESSAGES.GENERAL.VALIDATION_ERROR,
          detalhes: error.errors,
        });
      }
      return res
        .status(500)
        .json({ error: MESSAGES.GENERAL.UPDATE_ERROR("Funcionarío") });
    }
  }

  async deleteWorker(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ error: MESSAGES.GENERAL.INVALID_ID });
      }

      const deleted = await Worker.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ error: "Funcionarío não encontrado." });
      }

      return res.status(200).json({
        message: MESSAGES.GENERAL.DELETE_SUCCESS("Funcionarío"),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: MESSAGES.GENERAL.DELETE_ERROR("Funcionarío") });
    }
  }
}

module.exports = new WorkerController();
