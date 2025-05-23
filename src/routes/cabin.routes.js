const { Router } = require("express");
const cabinRoutes = new Router();
const CabinController = require("../controllers/CabinController");
const validate = require("../middleware/validationsYup");
const cabinValidation = require("../validations/cabinValidation");
const auth = require("../middleware/auth");

cabinRoutes.get("/", auth, CabinController.getAllCabins);
cabinRoutes.get("/:id", auth, CabinController.getCabinById);
cabinRoutes.post(
  "/",
  validate(cabinValidation),
  auth,
  CabinController.createCabin
);
cabinRoutes.post(
  "/:id/duplicate",
  validate(cabinValidation),
  auth,
  CabinController.createBooking
);
cabinRoutes.put(
  "/:id",
  validate(cabinValidation),
  auth,
  CabinController.updateCabin
);
cabinRoutes.delete("/:id", auth, CabinController.deleteCabin);

module.exports = cabinRoutes;
