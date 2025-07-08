const { Op } = require("sequelize");
const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");
const findById = require("../utils/findById");
const updatedFields = require("../utils/updatedFields");

async function getAllCabins({
  page = 1,
  limit,
  orderBy = "name",
  order = "ASC",
  discountFilter = "all",
  search = "",
}) {
  let parsedLimit = limit !== undefined ? parseInt(limit) : undefined;
  const offset = parsedLimit ? (page - 1) * parsedLimit : undefined;

  const allowedOrderFields = {
    name: "name",
    regularPrice: "regularPrice",
    maxCapacity: "maxCapacity",
  };
  const orderField = allowedOrderFields[orderBy] || "name";
  const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const where = {};

  if (discountFilter === "with-discount") {
    where.discount = { [Op.gt]: 0 };
  } else if (discountFilter === "no-discount") {
    where.discount = 0;
  }

  if (search) {
    where.name = { [Op.iLike]: `%${search}%` };
    parsedLimit = undefined;
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

  const { count, rows } = await Cabin.findAndCountAll(queryOptions);

  const cabinsObj = {
    cabins: rows,
    total: count,
    page,
    limit: parsedLimit,
    pageCount: parsedLimit ? Math.ceil(count / parsedLimit) : 1,
  };

  return { resource: cabinsObj, error: null, status: 200 };
}

async function getCabinById(id) {
  const cabin = await findById(Cabin, id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  if (!cabin) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "CABIN_NOT_FOUND",
        message: MESSAGES.NOT_FOUND("Cabana"),
        source: "cabinService - getCabinById",
        detalhes: null,
      },
      status: 404,
    };
  }
  const cabinObj = cabin.toJSON();
  return { resource: cabinObj, error: null, status: 200 };
}

async function createCabin(data) {
  const { name, maxCapacity, regularPrice, discount, description, file } = data;

  let imageUrl = null;
  if (file) {
    imageUrl = await uploadFileCloudinary(file, "cabins");
  }

  const existingCabin = await Cabin.findOne({ where: { name } });
  if (existingCabin) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "CABIN_ALREADY_EXISTS",
        message: MESSAGES.GENERAL.ALREADY_EXISTS("essa cabana"),
        source: "cabinService - createCabin",
        detalhes: null,
      },
      status: 409,
    };
  }

  const cabin = await Cabin.create({
    name,
    maxCapacity,
    regularPrice,
    discount,
    image: imageUrl,
    description,
  });

  const cabinObj = cabin.toJSON();
  return { resource: cabinObj, error: null, status: 201 };
}

async function duplicateCabin(id) {
  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "CABIN_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
        source: "cabinService - duplicateCabin",
        detalhes: null,
      },
      status: 404,
    };
  }
  const { maxCapacity, regularPrice, discount, image, description } =
    existingCabin;

  const newName = `${existingCabin.name} (Cópia)`;
  const nameExists = await Cabin.findOne({ where: { name: newName } });
  if (nameExists) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "CABIN_ALREADY_EXISTS",
        message: MESSAGES.GENERAL.ALREADY_EXISTS("essa cabana"),
        source: "cabinService - duplicateCabin",
        detalhes: null,
      },
      status: 409,
    };
  }

  const duplicatedCabin = await Cabin.create({
    name: newName,
    maxCapacity,
    regularPrice,
    discount,
    image,
    description,
  });

  const cabinObj = duplicatedCabin.toJSON();
  return { resource: cabinObj, error: null, status: 201 };
}

async function updateCabin(id, data) {
  const { name, maxCapacity, regularPrice, discount, description, file } = data;

  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "CABIN_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
        source: "cabinService - updateCabin",
        detalhes: null,
      },
      status: 404,
    };
  }

  let imageUrl = existingCabin.image;
  if (file) {
    imageUrl = await uploadFileCloudinary(file, "cabins");
  }

  const nameConflict = await Cabin.findOne({
    where: {
      name,
      id: { [Op.ne]: id },
    },
  });

  if (nameConflict) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "CABIN_ALREADY_EXISTS",
        message: MESSAGES.GENERAL.ALREADY_EXISTS("Cabana"),
        source: "cabinService - updateCabin",
        detalhes: null,
      },
      status: 409,
    };
  }

  const fields = [
    "name",
    "maxCapacity",
    "regularPrice",
    "discount",
    "description",
  ];

  const updatedData = updatedFields(data, fields);
  updatedData.image = imageUrl;

  await Cabin.update(updatedData, { where: { id } });

  const updatedCabin = await Cabin.findByPk(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  const cabinObj = updatedCabin.toJSON();
  return { resource: cabinObj, error: null, status: 200 };
}

async function deleteCabin(id) {
  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "CABIN_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
        source: "cabinService - deleteCabin",
        detalhes: null,
      },
      status: 404,
    };
  }
  const bookingsCount = await Booking.count({ where: { cabinId: id } });
  if (bookingsCount > 0) {
    return {
      resource: null,
      error: {
        status: 409,
        errorCode: "CABIN_ASSOCIATED",
        message: MESSAGES.GENERAL.ASSOCIATED("Cabana"),
        source: "cabinService - deleteCabin",
        detalhes: null,
      },
      status: 409,
    };
  }
  await Cabin.destroy({ where: { id } });
  return {
    resource: null,
    error: null,
    status: 200,
  };
}
module.exports = {
  getAllCabins,
  getCabinById,
  createCabin,
  duplicateCabin,
  updateCabin,
  deleteCabin,
};
