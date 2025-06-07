const { Op } = require("sequelize");
const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");

async function getAllCabins({ limit, offset, orderField, orderDirection }) {
  return await Cabin.findAll({
    limit,
    offset,
    order: [[orderField, orderDirection]],
    include: [{ model: Booking, as: "bookings" }],
  });
}

async function getCabinById(id) {
  if (isNaN(id)) {
    return { error: MESSAGES.GENERAL.INVALID_ID, status: 400 };
  }
  const cabin = await Cabin.findByPk(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  if (!cabin) {
    return { error: MESSAGES.CABIN.NOT_FOUND, status: 404 };
  }
  return { cabin };
}

async function createCabin({
  name,
  maxCapacity,
  regularPrice,
  discount,
  description,
  file,
}) {
  let imageUrl = null;
  if (file) {
    imageUrl = await uploadFileCloudinary(file, "cabins");
  }

  const existingCabin = await Cabin.findOne({ where: { name } });
  if (existingCabin) {
    return { error: MESSAGES.CABIN.NAME_EXISTS, status: 409 };
  }

  const cabin = await Cabin.create({
    name,
    maxCapacity,
    regularPrice,
    discount,
    image: imageUrl,
    description,
  });

  return { cabin };
}

async function duplicateCabin(id) {
  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Cabana"), status: 404 };
  }

  const newName = `${existingCabin.name} (Cópia)`;
  const nameExists = await Cabin.findOne({ where: { name: newName } });
  if (nameExists) {
    return { error: MESSAGES.ALREADY_EXISTS("essa cabana"), status: 409 };
  }

  const duplicatedCabin = await Cabin.create({
    name: newName,
    maxCapacity: existingCabin.maxCapacity,
    regularPrice: existingCabin.regularPrice,
    discount: existingCabin.discount,
    image: existingCabin.image,
    description: existingCabin.description,
  });

  return { cabin: duplicatedCabin };
}

async function updateCabin(
  id,
  { name, maxCapacity, regularPrice, discount, description, file }
) {
  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Cabana"), status: 404 };
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
    return { error: MESSAGES.GENERAL.ALREADY_EXISTS("Cabana"), status: 409 };
  }

  await Cabin.update(
    {
      name,
      maxCapacity,
      regularPrice,
      discount,
      image: imageUrl,
      description,
    },
    { where: { id } }
  );

  const updatedCabin = await Cabin.findByPk(id, {
    include: [{ model: Booking, as: "bookings" }],
  });
  return { cabin: updatedCabin };
}

async function deleteCabin(id) {
  const existingCabin = await findById(Cabin, id);
  if (!existingCabin) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Cabana"), status: 404 };
  }
  const bookingsCount = await Booking.count({ where: { cabinId: id } });
  if (bookingsCount > 0) {
    return { error: MESSAGES.GENERAL.ASSOCIATED("Cabana"), status: 409 };
  }
  await Cabin.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  getAllCabins,
  getCabinById,
  createCabin,
  duplicateCabin,
  updateCabin,
  deleteCabin,
};
