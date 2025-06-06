const { Op } = require("sequelize");
const Guest = require("../models/Guest");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const findById = require("../utils/findById");

async function getGuestById(id) {
  const guest = await Guest.findByPk(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  if (!guest) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"), status: 404 };
  }
  return { guest };
}
async function hasBookings(guestId) {
  const bookingsCount = await Booking.count({ where: { guestId } });
  return bookingsCount > 0;
}
async function createGuest({
  fullName,
  email,
  nationality,
  countryFlag,
  nationalIdNumber,
}) {
  const existingGuest = await Guest.findOne({
    where: {
      [Op.or]: [{ email }, { nationalIdNumber }],
    },
  });

  if (existingGuest) {
    return { error: MESSAGES.GUEST.EMAIL_OR_ID_EXISTS, status: 409 };
  }

  const guest = await Guest.create({
    fullName,
    email,
    nationality,
    countryFlag,
    nationalIdNumber,
  });

  return { guest };
}

async function updateGuest(
  id,
  { fullName, email, nationality, countryFlag, nationalIdNumber }
) {
  const existingGuest = await findById(Guest, id);
  if (!existingGuest) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"), status: 404 };
  }

  const duplicateGuest = await Guest.findOne({
    where: {
      [Op.or]: [{ email }, { nationalIdNumber }],
      id: { [Op.ne]: id },
    },
  });

  if (duplicateGuest) {
    return { error: MESSAGES.GUEST.EMAIL_OR_ID_EXISTS, status: 409 };
  }

  await Guest.update(
    { fullName, email, nationality, countryFlag, nationalIdNumber },
    { where: { id } }
  );

  const updatedGuest = await Guest.findByPk(id);

  return { guest: updatedGuest };
}

async function deleteGuest(id) {
  const existingGuest = await findById(Guest, id);
  if (!existingGuest) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"), status: 404 };
  }

  const bookingsCount = await Booking.count({ where: { guestId: id } });
  if (bookingsCount > 0) {
    return { error: MESSAGES.GENERAL.ASSOCIATED_BOOKINGS, status: 409 };
  }

  await Guest.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  getGuestById,
  hasBookings,
  createGuest,
  updateGuest,
  deleteGuest,
};
