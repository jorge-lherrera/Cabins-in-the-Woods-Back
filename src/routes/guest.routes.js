const { Router } = require("express");
const guestRoutes = new Router();
const GuestController = require("../controllers/GuestController");

guestRoutes.get("/", GuestController.getAllGuests);
guestRoutes.get("/:id", GuestController.getGuestById);
guestRoutes.post("/", GuestController.createGuest);
guestRoutes.put("/:id", GuestController.updateGuest);
guestRoutes.delete("/:id", GuestController.deleteGuest);

module.exports = guestRoutes;
