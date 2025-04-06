const { Router } = require("express");
const cabinRoutes = new Router();
const CabinController = require("../controllers/CabinController");

cabinRoutes.get("/", CabinController.getAllCabins);
cabinRoutes.get("/:id", CabinController.getCabinById);
cabinRoutes.post("/", CabinController.createCabin);
cabinRoutes.put("/:id", CabinController.updateCabin);
cabinRoutes.delete("/:id", CabinController.deleteCabin);

module.exports = cabinRoutes;
