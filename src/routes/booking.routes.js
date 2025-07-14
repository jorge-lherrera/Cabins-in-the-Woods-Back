const { Router } = require("express");
const bookingRoutes = new Router();
const BookingController = require("../controllers/BookingController");
const validate = require("../middleware/validationsYup");
const bookingValidation = require("../validations/bookingValidation");
const auth = require("../middleware/auth");
const normalizeBookingDates = require("../middleware/normalizeBookingDates");
const makeAllFieldsOptional = require("../utils/yupUtils");
const normalizeNumericFields = require("../middleware/normalizeNumericFields");

/**
 * @swagger
 * /bookings/dashboard:
 *   get:
 *     summary: Obtiene el dashboard de reservas
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Dashboard de reservas
 */
bookingRoutes.get(
  "/dashboard",
  auth,
  BookingController.getAllBookingsDashboard
);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Obtiene todas las reservas
 *     security:
 *       - apiKeyAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
bookingRoutes.get("/", auth, BookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Obtiene una reserva por ID
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva encontrada
 */
bookingRoutes.get("/:id", auth, BookingController.getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Crea una nueva reserva
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Booking'
 *     responses:
 *       201:
 *         description: Reserva creada
 */
bookingRoutes.post(
  "/",
  auth,
  normalizeBookingDates,
  normalizeNumericFields(["cabinId", "guestId", "numGuests", "extrasPrice"]),
  validate(bookingValidation),
  BookingController.createBooking
);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Actualiza una reserva existente
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Booking'
 *     responses:
 *       200:
 *         description: Reserva actualizada
 */
bookingRoutes.put(
  "/:id",
  auth,
  normalizeBookingDates,
  normalizeNumericFields(["cabinId", "guestId", "numGuests", "extrasPrice"]),
  validate(makeAllFieldsOptional(bookingValidation)),
  BookingController.updateBooking
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Elimina una reserva
 *     security:
 *       - apiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reserva eliminada
 */
bookingRoutes.delete("/:id", auth, BookingController.deleteBooking);

module.exports = bookingRoutes;
