const Worker = require("../models/Worker");

class WorkerController {
  async getWorkerById(req, res) {
    try {
      const { id } = req.params;
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
      const { name, email, avatar, password } = req.body;
      const worker = await Worker.create({
        name,
        email,
        avatar,
        password,
      });
      res.status(201).json(worker);
    } catch (error) {
      res.status(500).json({ error: "Error al crear el trabajador" });
    }
  }

  async updateWorker(req, res) {
    try {
      const { id } = req.params;
      const updated = await Worker.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Trabajador no encontrado" });
      }
      res.json({ message: "Trabajador actualizado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar el trabajador" });
    }
  }

  async deleteWorker(req, res) {
    try {
      const { id } = req.params;
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
