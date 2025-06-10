export async function checkOverlap({
  cabinId,
  startDate,
  endDate,
  excludeId = null,
}) {
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
      error: MESSAGES.BOOKING.DUPLICATE_BOOKING,
      status: 409,
    };
  }
  return {
    resource: null,
    error: null,
    status: 200,
  };
}
