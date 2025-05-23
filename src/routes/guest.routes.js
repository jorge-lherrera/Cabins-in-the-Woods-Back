const { Router } = require("express");
const guestRoutes = new Router();
const GuestController = require("../controllers/GuestController");
const validate = require("../middleware/validationsYup");
const guestValidation = require("../validations/guestValidation");
const auth = require("../middleware/auth");

guestRoutes.get("/:id", auth, GuestController.getGuestById);
guestRoutes.post(
  "/",
  validate(guestValidation),
  auth,
  GuestController.createGuest
);
guestRoutes.put(
  "/:id",
  validate(guestValidation),
  auth,
  GuestController.updateGuest
);
guestRoutes.delete("/:id", auth, GuestController.deleteGuest);

module.exports = guestRoutes;
