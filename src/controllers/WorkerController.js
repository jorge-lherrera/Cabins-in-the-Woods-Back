const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const MESSAGES = require("../utils/messages");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

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
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionário") });
      }

      return res.status(200).json(worker);
    } catch (error) {
      next(error);
    }
  }

  async createWorker(req, res, next) {
    try {
      const { name, email, password } = req.body;
      let avatarUrl = null;

      if (req.file) {
        avatarUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "workers" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
      }

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
        avatar: avatarUrl,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: MESSAGES.GENERAL.CREATE_SUCCESS("Funcionário"),
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
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionário") });
      }

      const { name, email, password, currentPassword } = req.body;
      let avatarUrl = existingWorker.avatar;

      if (req.file) {
        avatarUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "workers" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
      }

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
        avatar: avatarUrl,
      };

      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      await Worker.update(updatedData, { where: { id } });

      return res.status(200).json({
        message: MESSAGES.GENERAL.UPDATE_SUCCESS("Funcionário"),
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
          .json({ error: MESSAGES.GENERAL.NOT_FOUND("Funcionário") });
      }

      await Worker.destroy({ where: { id } });

      return res.status(200).json({
        message: MESSAGES.GENERAL.DELETE_SUCCESS("Funcionário"),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WorkerController();
