const { Op } = require("sequelize");
const Booking = require("../models/Booking");
const MESSAGES = require("./messages");

async function checkOverlap({ cabinId, startDate, endDate, excludeId = null }) {
  const where = {
    cabinId,
    [Op.or]: [
      { startDate: { [Op.between]: [startDate, endDate] } },
      { endDate: { [Op.between]: [startDate, endDate] } },
      {
        [Op.and]: [
          { startDate: { [Op.lte]: startDate } },
          { endDate: { [Op.gte]: endDate } },
        ],
      },
    ],
  };
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }
  const overlappingBooking = await Booking.findOne({ where });
  if (overlappingBooking) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "BOOKING_OVERLAP",
        message: MESSAGES.BOOKING.DUPLICATE_BOOKING,
        source: "checkOverlap",
        detalhes: null,
      },
      status: 409,
    };
  }
  return {
    resource: null,
    error: null,
    status: 200,
  };
}

module.exports = checkOverlap;
