const { Router } = require("express");
const cabinRoutes = require("./cabin.routes");
const guestRoutes = require("./guest.routes");
const settingRoutes = require("./setting.routes");
const workerRoutes = require("./worker.routes");
const bookingRoutes = require("./booking.routes");
const loginRoutes = require("./login.routes");

const routes = Router();

routes.use("/login", loginRoutes);
routes.use("/cabins", cabinRoutes);
routes.use("/guests", guestRoutes);
routes.use("/settings", settingRoutes);
routes.use("/workers", workerRoutes);
routes.use("/bookings", bookingRoutes);

module.exports = routes;
