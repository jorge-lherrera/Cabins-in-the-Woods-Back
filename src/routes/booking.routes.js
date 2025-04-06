const { Router } = require("express");
const bookingRoutes = new Router();
const BookingController = require("../controllers/BookingController");

bookingRoutes.get("/", BookingController.getAllBookings);
bookingRoutes.get("/:id", BookingController.getBookingById);
bookingRoutes.post("/", BookingController.createBooking);
bookingRoutes.put("/:id", BookingController.updateBooking);
bookingRoutes.delete("/:id", BookingController.deleteBooking);

module.exports = bookingRoutes;
