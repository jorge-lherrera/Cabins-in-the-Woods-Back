const Cabin = require("../models/Cabin");
const Guest = require("../models/Guest");
const Setting = require("../models/Setting");
const MESSAGES = require("./messages");

async function validateBusinessRules(data) {
  const {
    cabinId,
    guestId,
    numNights,
    numGuests,
    hasBreakfast,
    extrasPrice = 0,
  } = data;

  const setting = await Setting.findOne();
  if (!setting) {
    return {
      resource: null,
      error: {
        status: 500,
        errorCode: "SETTING_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
        source: "validateBusinessRules.setting",
        detalhes: null,
      },
      status: 500,
    };
  }

  if (
    numNights < setting.minBookingLength ||
    numNights > setting.maxBookingLength
  ) {
    return {
      resource: null,
      error: {
        status: 400,
        errorCode: "INVALID_BOOKING_LENGTH",
        message: `O número de noites deve estar entre ${setting.minBookingLength} e ${setting.maxBookingLength}.`,
        source: "validateBusinessRules.numNights",
        detalhes: {
          minBookingLength: setting.minBookingLength,
          maxBookingLength: setting.maxBookingLength,
          numNights,
        },
      },
      status: 400,
    };
  }
  if (numGuests > setting.maxGuestsPerBooking) {
    return {
      resource: null,
      error: {
        status: 400,
        errorCode: "MAX_GUESTS_EXCEEDED",
        message: `O número máximo de hóspedes por reserva é ${setting.maxGuestsPerBooking}.`,
        source: "validateBusinessRules.numGuests",
        detalhes: {
          maxGuestsPerBooking: setting.maxGuestsPerBooking,
          numGuests,
        },
      },
      status: 400,
    };
  }

  const cabin = await Cabin.findByPk(cabinId);
  if (!cabin) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "CABIN_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
        source: "validateBusinessRules.cabin",
        detalhes: { cabinId },
      },
      status: 404,
    };
  }

  const guest = await Guest.findByPk(guestId);
  if (!guest) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "GUEST_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
        source: "validateBusinessRules.guest",
        detalhes: { guestId },
      },
      status: 404,
    };
  }

  const regularPrice = Number(cabin.regularPrice) || 0;
  const discount = Number(cabin.discount) || 0;
  const cabinPrice = regularPrice - discount;

  const basePrice = (cabinPrice + Number(extrasPrice)) * numNights;
  const breakfastCost = hasBreakfast
    ? Number(setting.breakfastPrice) * numGuests * numNights
    : 0;
  const finalTotalPrice = basePrice + breakfastCost;

  return {
    resource: { finalTotalPrice, cabinPrice },
    error: null,
    status: 200,
  };
}
module.exports = validateBusinessRules;
