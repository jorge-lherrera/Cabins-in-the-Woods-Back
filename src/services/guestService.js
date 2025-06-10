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
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      status: 404,
    };
  }

  const guestObj = guest.toJSON();
  return { resource: guestObj, error: null, status: 200 };
}

async function createGuest(data) {
  const { fullName, email, nationality, countryFlag, nationalIdNumber } = data;

  const existingGuest = await Guest.findOne({
    where: {
      [Op.or]: [{ email }, { nationalIdNumber }],
    },
  });

  if (existingGuest) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.ALREADY_EXISTS("Hóspede ou nationalId"),
      status: 409,
    };
  }

  const guest = await Guest.create({
    fullName,
    email,
    nationality,
    countryFlag,
    nationalIdNumber,
  });
  const guestObj = guest.toJSON();

  return { resource: guestObj, error: null, status: 201 };
}

async function updateGuest(id, data) {
  const { fullName, email, nationality, countryFlag, nationalIdNumber } = data;

  const existingGuest = await findById(Guest, id);
  if (!existingGuest) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      status: 404,
    };
  }

  const duplicateGuest = await Guest.findOne({
    where: {
      [Op.or]: [{ email }, { nationalIdNumber }],
      id: { [Op.ne]: id },
    },
  });

  if (duplicateGuest) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.ALREADY_EXISTS("Hóspede ou nationalId"),
      status: 409,
    };
  }

  const updatedData = {
    fullName,
    email,
    nationality,
    countryFlag,
    nationalIdNumber,
  };

  await Guest.update(updatedData, { where: { id } });

  const updatedGuest = await Guest.findByPk(id);

  const guestObj = updatedGuest.toJSON();
  return { resource: guestObj, error: null, status: 200 };
}

async function deleteGuest(id) {
  const existingGuest = await findById(Guest, id);
  if (!existingGuest) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
      status: 404,
    };
  }

  const bookingsCount = await Booking.count({ where: { guestId: id } });
  if (bookingsCount > 0) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.ASSOCIATED("Hóspede"),
      status: 409,
    };
  }

  await Guest.destroy({ where: { id } });
  return { resource: null, error: null, status: 200 };
}

module.exports = {
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
};
