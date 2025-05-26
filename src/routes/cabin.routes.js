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
  auth,
  upload.single("image"),
  validate(cabinValidation),
  CabinController.createCabin
);
cabinRoutes.post(
  "/:id/duplicate",
  auth,
  validate(cabinValidation),
  CabinController.duplicateCabin
);
cabinRoutes.put(
  "/:id",
  auth,
  upload.single("image"),
  validate(cabinValidation),
  CabinController.updateCabin
);
cabinRoutes.delete("/:id", auth, CabinController.deleteCabin);

module.exports = cabinRoutes;
