const { Router } = require("express");
const bookingRoutes = new Router();
const BookingController = require("../controllers/BookingController");
const validate = require("../middleware/validationsYup");
const bookingValidation = require("../validations/bookingValidation");
const auth = require("../middleware/auth");
const normalizeBookingDates = require("../middleware/normalizeBookingDates");
const makeAllFieldsOptional = require("../utils/yupUtils");
const normalizeNumericFields = require("../middleware/normalizeNumericFields");

bookingRoutes.get(
  "/dashboard",
  auth,
  BookingController.getAllBookingsDashboard
);
bookingRoutes.get("/", auth, BookingController.getAllBookings);
bookingRoutes.get("/:id", auth, BookingController.getBookingById);
bookingRoutes.post(
  "/",
  auth,
  normalizeBookingDates,
  normalizeNumericFields([
    "cabinId",
    "guestId",
    "numNights",
    "numGuests",
    "extrasPrice",
  ]),
  validate(bookingValidation),
  BookingController.createBooking
);
bookingRoutes.put(
  "/:id",
  auth,
  normalizeBookingDates,
  normalizeNumericFields([
    "cabinId",
    "guestId",
    "numNights",
    "numGuests",
    "extrasPrice",
  ]),
  validate(makeAllFieldsOptional(bookingValidation)),
  BookingController.updateBooking
);
bookingRoutes.delete("/:id", auth, BookingController.deleteBooking);

module.exports = bookingRoutes;
