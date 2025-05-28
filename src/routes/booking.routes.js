const { Router } = require("express");
const bookingRoutes = new Router();
const BookingController = require("../controllers/BookingController");
const validate = require("../middleware/validationsYup");
const bookingValidation = require("../validations/bookingValidation");
const auth = require("../middleware/auth");
const normalizeBookingDates = require("../middleware/normalizeBookingDates");

bookingRoutes.get("/", auth, BookingController.getAllBookings);
bookingRoutes.get("/:id", auth, BookingController.getBookingById);
bookingRoutes.post(
  "/",
  auth,
  normalizeBookingDates,
  validate(bookingValidation),
  BookingController.createBooking
);
bookingRoutes.put(
  "/:id",
  auth,
  normalizeBookingDates,
  validate(bookingValidation),
  BookingController.updateBooking
);
bookingRoutes.delete("/:id", auth, BookingController.deleteBooking);

module.exports = bookingRoutes;
