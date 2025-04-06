const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");

class CabinController {
  
  async getAllCabins(req, res) {
    try {
      const cabins = await Cabin.findAll({
        include: [{ model: Booking, as: "bookings" }],
      });
      res.json(cabins);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las cabañas" });
    }
  }

  
  async getCabinById(req, res) {
    try {
      const { id } = req.params;
      const cabin = await Cabin.findByPk(id, {
        include: [{ model: Booking, as: "bookings" }],
      });
      if (!cabin) {
        return res.status(404).json({ error: "Cabaña no encontrada" });
      }
      res.json(cabin);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la cabaña" });
    }
  }

  
  async createCabin(req, res) {
    try {
      const { name, maxCapacity, regularPrice, discount, image, description } =
        req.body;
      const cabin = await Cabin.create({
        name,
        maxCapacity,
        regularPrice,
        discount,
        image,
        description,
      });
      res.status(201).json(cabin);
    } catch (error) {
      res.status(500).json({ error: "Error al crear la cabaña" });
    }
  }

  
  async updateCabin(req, res) {
    try {
      const { id } = req.params;
      const updated = await Cabin.update(req.body, { where: { id } });
      if (!updated[0]) {
        return res.status(404).json({ error: "Cabaña no encontrada" });
      }
      res.json({ message: "Cabaña actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la cabaña" });
    }
  }

  
  async deleteCabin(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Cabin.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({ error: "Cabaña no encontrada" });
      }
      res.json({ message: "Cabaña eliminada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la cabaña" });
    }
  }
}

module.exports = new CabinController();
