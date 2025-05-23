const { Router } = require("express");
const cabinRoutes = new Router();
const CabinController = require("../controllers/CabinController");
const validate = require("../middleware/validationsYup");
const cabinValidation = require("../validations/cabinValidation");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

cabinRoutes.get("/", auth, CabinController.getAllCabins);
cabinRoutes.get("/:id", auth, CabinController.getCabinById);
cabinRoutes.post(
  "/",
  upload.single("image"),
  validate(cabinValidation),
  auth,
  CabinController.createCabin
);
cabinRoutes.post(
  "/:id/duplicate",
  validate(cabinValidation),
  auth,
  CabinController.duplicateCabin
);
cabinRoutes.put(
  "/:id",
  upload.single("image"),
  validate(cabinValidation),
  auth,
  CabinController.updateCabin
);
cabinRoutes.delete("/:id", auth, CabinController.deleteCabin);

module.exports = cabinRoutes;
