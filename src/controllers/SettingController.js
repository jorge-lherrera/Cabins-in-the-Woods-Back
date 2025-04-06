const Setting = require("../models/Setting");

class SettingController {
  async getAllSettings(req, res) {
    try {
      const settings = await Setting.findAll();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las configuraciones" });
    }
  }

  async createSetting(req, res) {
    try {
      const { minBookingLength, maxBookingLength, breakfastPrice } = req.body;
      const setting = await Setting.create({
        minBookingLength,
        maxBookingLength,
        breakfastPrice,
      });
      res.status(201).json(setting);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la configuración" });
    }
  }

  async updateSetting(req, res) {
    try {
      const { id } = req.params;
      const updated = await Setting.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Configuración no encontrada" });
      }
      res.json({ message: "Configuración actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la configuración" });
    }
  }
}

module.exports = new SettingController();
