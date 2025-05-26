const { Op } = require("sequelize");
const Booking = require("../models/Booking");
const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const Setting = require("../models/Setting");
const MESSAGES = require("../utils/messages");

async function validateBusinessRules({
  numNights,
  numGuests,
  hasBreakfast,
  totalPrice,
}) {
  const setting = await Setting.findOne();
  if (!setting) {
    return { error: "Configuração não encontrada.", status: 500 };
  }
  if (
    numNights < setting.minBookingLength ||
    numNights > setting.maxBookingLength
  ) {
    return {
      error: `O número de noites deve estar entre ${setting.minBookingLength} e ${setting.maxBookingLength}.`,
      status: 400,
    };
  }
  if (numGuests > setting.maxGuestsPerBooking) {
    return {
      error: `O número máximo de hóspedes por reserva é ${setting.maxGuestsPerBooking}.`,
      status: 400,
    };
  }
  let finalTotalPrice = totalPrice;
  if (hasBreakfast) {
    finalTotalPrice += setting.breakfastPrice;
  }
  return { finalTotalPrice };
}

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
    return { error: MESSAGES.BOOKING.DUPLICATE_BOOKING, status: 409 };
  }
  return {};
}

async function createBooking(data) {
  const {
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  } = data;

  const cabin = await Cabin.findByPk(cabinId);
  const guest = await Guest.findByPk(guestId);

  if (!cabin || !guest) {
    return {
      error: !cabin
        ? MESSAGES.GENERAL.NOT_FOUND("Cabana")
        : MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      status: 409,
    };
  }

  const overlap = await checkOverlap({ cabinId, startDate, endDate });
  if (overlap.error) return overlap;

  const rules = await validateBusinessRules({
    numNights,
    numGuests,
    hasBreakfast,
    totalPrice,
  });
  if (rules.error) return rules;

  const booking = await Booking.create({
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice: rules.finalTotalPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  });

  return { booking };
}

async function updateBooking(id, data) {
  const existingBooking = await Booking.findByPk(id);
  if (!existingBooking) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Reserva"), status: 404 };
  }

  const {
    cabinId,
    guestId,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    hasBreakfast,
    observations,
    isPaid,
    status,
  } = data;

  const rules = await validateBusinessRules({
    numNights,
    numGuests,
    hasBreakfast,
    totalPrice,
  });
  if (rules.error) return rules;

  let datesChanged =
    existingBooking.startDate.getTime() !== new Date(startDate).getTime() ||
    existingBooking.endDate.getTime() !== new Date(endDate).getTime();

  if (datesChanged) {
    const overlap = await checkOverlap({
      cabinId,
      startDate,
      endDate,
      excludeId: id,
    });
    if (overlap.error) return overlap;
  }

  await Booking.update(
    {
      cabinId,
      guestId,
      startDate,
      endDate,
      numNights,
      numGuests,
      cabinPrice,
      extrasPrice,
      totalPrice: rules.finalTotalPrice,
      hasBreakfast,
      observations,
      isPaid,
      status: status || existingBooking.status,
    },
    { where: { id } }
  );

  const updatedBooking = await Booking.findByPk(id);

  return { booking: updatedBooking };
}

async function deleteBooking(id) {
  const existingBooking = await Booking.findByPk(id);
  if (!existingBooking) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Reserva"), status: 404 };
  }
  await Booking.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
};
