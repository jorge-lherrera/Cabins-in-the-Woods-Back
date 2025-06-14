const { Op } = require("sequelize");
const Guest = require("../models/Guest");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const findById = require("../utils/findById");
const updatedFields = require("../utils/updatedFields");

async function getAllGuests({
  page = 1,
  limit = 10,
  orderBy = "name",
  order = "ASC",
  nationality = "all",
}) {
  const parsedLimit = parseInt(limit);
  const offset = (page - 1) * parsedLimit;

  const allowedOrderFields = {
    name: "fullName",
    email: "email",
    nationality: "nationality",
  };

  const orderField = allowedOrderFields[orderBy] || "fullName";
  const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  if (nationality === "all") {
    const { count, rows } = await Guest.findAndCountAll({
      limit: parsedLimit,
      offset,
      order: [[orderField, orderDirection]],
      include: [{ model: Booking, as: "bookings" }],
    });

    return {
      resource: {
        guests: rows,
        total: count,
        page,
        pageCount: Math.ceil(count / parsedLimit),
      },
      error: null,
      status: 200,
    };
  }

  const allGuests = await Guest.findAll({
    order: [[orderField, orderDirection]],
    include: [{ model: Booking, as: "bookings" }],
  });

  const grouped = allGuests.reduce((acc, guest) => {
    const country = guest.nationality || "Unknown";
    if (!acc[country]) acc[country] = [];
    acc[country].push(guest);
    return acc;
  }, {});

  const countries = Object.keys(grouped).sort();

  const pagedCountries = countries.slice(offset, offset + parsedLimit);

  const result = {};
  pagedCountries.forEach((country) => {
    result[country] = grouped[country];
  });

  return {
    resource: {
      groupedGuests: result,
      totalCountries: countries.length,
      page,
      pageCount: Math.ceil(countries.length / parsedLimit),
    },
    error: null,
    status: 200,
  };
}

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

  const duplicateWhere = [];
  if (email) duplicateWhere.push({ email: email });
  if (nationalIdNumber)
    duplicateWhere.push({ nationalIdNumber: nationalIdNumber });

  const duplicateGuest = await Guest.findOne({
    where: {
      [Op.or]: duplicateWhere,
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

  const fields = [
    "fullName",
    "email",
    "nationality",
    "countryFlag",
    "nationalIdNumber",
  ];

  const updatedData = updatedFields(data, fields);

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
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
};
