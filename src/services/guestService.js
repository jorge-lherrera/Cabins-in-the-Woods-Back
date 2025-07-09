const { Op } = require("sequelize");
const Guest = require("../models/Guest");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const findById = require("../utils/findById");
const updatedFields = require("../utils/updatedFields");

async function getAllGuests({
  page = 1,
  limit,
  orderBy = "name",
  order = "ASC",
  nationality = "",
  search = "",
  searchNation = "",
}) {
  let parsedLimit = limit !== undefined ? parseInt(limit) : undefined;
  const offset = parsedLimit ? (page - 1) * parsedLimit : undefined;

  const allowedOrderFields = {
    name: "fullName",
    email: "email",
  };

  const orderField = allowedOrderFields[orderBy] || "name";
  const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const where = {};
  if (nationality) {
    where.nationality = nationality;
  }

  if (search) {
    (where.fullName = { [Op.iLike]: `%${search}%` }), (parsedLimit = undefined);
  }

  if (searchNation) {
    (where.nationality = { [Op.iLike]: `%${searchNation}%` }),
      (parsedLimit = undefined);
  }

  const queryOptions = {
    order: [[orderField, orderDirection]],
    where,
    include: [{ model: Booking, as: "bookings" }],
  };

  if (parsedLimit) {
    queryOptions.limit = parsedLimit;
    queryOptions.offset = offset;
  }

  const { count, rows } = await Guest.findAndCountAll(queryOptions);

  const guestsObj = {
    guests: rows,
    total: count,
    page,
    limit: parsedLimit,
    pageCount: parsedLimit ? Math.ceil(count / parsedLimit) : 1,
  };

  return { resource: guestsObj, error: null, status: 200 };
}

async function getGuestById(id) {
  const guest = await Guest.findByPk(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  if (!guest) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "GUEST_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
        source: "guestService.getGuestById",
        detalhes: { id },
      },
      status: 404,
    };
  }

  const guestObj = guest.toJSON();
  return { resource: guestObj, error: null, status: 200 };
}

async function createGuest(data) {
  const { fullName, email, nationality, nationalIdNumber } = data;

  const existingGuest = await Guest.findOne({
    where: {
      [Op.or]: [{ email }, { nationalIdNumber }],
    },
  });

  if (existingGuest) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "GUEST_ALREADY_EXISTS",
        message: MESSAGES.GENERAL.ALREADY_EXISTS("Hóspede ou nationalId"),
        source: "guestService.createGuest",
        detalhes: { email, nationalIdNumber },
      },
      status: 409,
    };
  }

  const guest = await Guest.create({
    fullName,
    email,
    nationality,

    nationalIdNumber,
  });
  const guestObj = guest.toJSON();

  return { resource: guestObj, error: null, status: 201 };
}

async function updateGuest(id, data) {
  const { fullName, email, nationality, nationalIdNumber } = data;

  const existingGuest = await findById(Guest, id);
  if (!existingGuest) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "GUEST_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
        source: "guestService.updateGuest",
        detalhes: { id },
      },
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
      error: {
        status: 409,
        errorCode: "GUEST_ALREADY_EXISTS",
        message: MESSAGES.GENERAL.ALREADY_EXISTS("Hóspede ou nationalId"),
        source: "guestService.updateGuest",
        detalhes: { email, nationalIdNumber },
      },
      status: 409,
    };
  }

  const fields = ["fullName", "email", "nationality", "nationalIdNumber"];

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
      error: {
        status: 404,
        errorCode: "GUEST_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Hóspede"),
        source: "guestService.deleteGuest",
        detalhes: { id },
      },
      status: 404,
    };
  }

  const bookingsCount = await Booking.count({ where: { guestId: id } });
  if (bookingsCount > 0) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "GUEST_HAS_BOOKINGS",
        message: MESSAGES.GENERAL.ASSOCIATED("Hóspede"),
        source: "guestService.deleteGuest",
        detalhes: { id },
      },
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
