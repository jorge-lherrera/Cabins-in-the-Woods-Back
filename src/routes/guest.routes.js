const { Router } = require("express");
const guestRoutes = new Router();
const GuestController = require("../controllers/GuestController");
const validate = require("../middleware/validationsYup");
const guestValidation = require("../validations/guestValidation");
const auth = require("../middleware/auth");
const makeAllFieldsOptional = require("../utils/yupUtils");

guestRoutes.get("/", auth, GuestController.getAllGuests);
guestRoutes.get("/:id", auth, GuestController.getGuestById);
guestRoutes.post(
  "/",
  auth,
  validate(guestValidation),
  GuestController.createGuest
);
guestRoutes.put(
  "/:id",
  auth,
  validate(makeAllFieldsOptional(guestValidation)),
  GuestController.updateGuest
);
guestRoutes.delete("/:id", auth, GuestController.deleteGuest);

module.exports = guestRoutes;
