import Cabin from "../models/Cabin";
import Setting from "../models/Setting";
import MESSAGES from "./messages";

export async function validateBusinessRules(data) {
  const { cabinId, numNights, numGuests, hasBreakfast, extrasPrice = 0 } = data;

  const setting = await Setting.findOne();
  if (!setting) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
      status: 500,
    };
  }

  if (
    numNights < setting.minBookingLength ||
    numNights > setting.maxBookingLength
  ) {
    return {
      resource: null,
      error: `O número de noites deve estar entre ${setting.minBookingLength} e ${setting.maxBookingLength}.`,
      status: 400,
    };
  }
  if (numGuests > setting.maxGuestsPerBooking) {
    return {
      resource: null,
      error: `O número máximo de hóspedes por reserva é ${setting.maxGuestsPerBooking}.`,
      status: 400,
    };
  }

  const cabin = await Cabin.findByPk(cabinId);
  if (!cabin) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
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
