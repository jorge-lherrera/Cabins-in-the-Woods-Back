const { Op } = require("sequelize");
const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");

async function getAllCabins({
  page = 1,
  limit = 10,
  orderBy = "name",
  order = "ASC",
  discountFilter,
}) {
  const parsedLimit = parseInt(limit);
  const offset = (page - 1) * parsedLimit;

  const allowedOrderFields = {
    name: "name",
    value: "regularPrice",
    guests: "maxCapacity",
  };
  const orderField = allowedOrderFields[orderBy] || "name";
  const orderDirection = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const where = {};
  if (discountFilter) {
    where.discount = { [Op.gte]: Number(discountFilter) };
  }

  const cabins = await Cabin.findAll({
    limit: parsedLimit,
    offset,
    order: [[orderField, orderDirection]],
    where,
    include: [{ model: Booking, as: "bookings" }],
  });

  const cabinObj = cabins.toJSON();

  return { resource: cabinObj, error: null, status: 200 };
}

async function getCabinById(id) {
  const cabin = await Cabin.findById(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  if (!cabin) {
    return { resource: null, error: MESSAGES.CABIN.NOT_FOUND, status: 404 };
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
      error: MESSAGES.ALREADY_EXISTS("essa cabana"),
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
      error: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
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
      error: MESSAGES.ALREADY_EXISTS("essa cabana"),
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
      error: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
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
      error: MESSAGES.GENERAL.ALREADY_EXISTS("Cabana"),
      status: 409,
    };
  }

  const updatedData = {
    name,
    maxCapacity,
    regularPrice,
    discount,
    image: imageUrl,
    description,
  };

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
      error: MESSAGES.GENERAL.NOT_FOUND("Cabana"),
      status: 404,
    };
  }
  const bookingsCount = await Booking.count({ where: { cabinId: id } });
  if (bookingsCount > 0) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.ASSOCIATED("Cabana"),
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
