const Worker = require("../models/Worker");
const bcrypt = require("bcrypt");
const workerValidation = require("../validations/workerValidation");

class WorkerController {
  async getWorkerById(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "El ID debe ser un número válido." });
      }

      const worker = await Worker.findByPk(id);
      if (!worker) {
        return res.status(404).json({ error: "Trabajador no encontrado" });
      }
      res.json(worker);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el trabajador" });
    }
  }

  async createWorker(req, res) {
    try {
      await workerValidation.validate(req.body, { abortEarly: false });

      const { name, email, avatar, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const worker = await Worker.create({
        name,
        email,
        avatar,
        password: hashedPassword,
      });
      res.status(201).json(worker);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Errores de validación en los datos proporcionados.",
          detalles: error.errors,
        });
      }
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está en uso." });
      }
      res.status(500).json({ error: "Error al crear el trabajador" });
    }
  }

  async updateWorker(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "El ID debe ser un número válido." });
      }

      await workerValidation.validate(req.body, { abortEarly: false });

      const updated = await Worker.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Trabajador no encontrado" });
      }

      res.json({ message: "Trabajador actualizado correctamente" });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          message: "Errores de validación en los datos proporcionados.",
          detalles: error.errors,
        });
      }
      res.status(500).json({ error: "Error al actualizar el trabajador" });
    }
  }

  async deleteWorker(req, res) {
    try {
      const { id } = req.params;
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "El ID debe ser un número válido." });
      }

      const deleted = await Worker.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Trabajador no encontrado" });
      }

      res.json({ message: "Trabajador eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el trabajador" });
    }
  }
}

module.exports = new WorkerController();
