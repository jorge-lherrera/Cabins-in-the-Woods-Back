function normalizeBookingDates(req, res, next) {
  if (typeof req.body.startDate === "string") {
    req.body.startDate = new Date(req.body.startDate);
  }
  if (typeof req.body.endDate === "string") {
    req.body.endDate = new Date(req.body.endDate);
  }
  next();
}

module.exports = normalizeBookingDates;
