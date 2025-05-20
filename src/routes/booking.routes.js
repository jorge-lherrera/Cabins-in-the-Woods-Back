const { Router } = require("express");
const bookingRoutes = new Router();
const BookingController = require("../controllers/BookingController");
const validate = require("../middleware/validationsYup");
const bookingValidation = require("../validations/bookingValidation");
const auth = require("../middleware/auth");

bookingRoutes.get("/", auth, BookingController.getAllBookings);
bookingRoutes.get("/:id", auth, BookingController.getBookingById);
bookingRoutes.post(
  "/",
  validate(bookingValidation),
  auth,
  BookingController.createBooking
);
bookingRoutes.put(
  "/:id",
  validate(bookingValidation),
  auth,
  BookingController.updateBooking
);
bookingRoutes.delete("/:id", auth, BookingController.deleteBooking);

module.exports = bookingRoutes;
