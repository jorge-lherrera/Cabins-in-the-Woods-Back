const { Op } = require("sequelize");
const Cabin = require("../models/Cabin");
const Booking = require("../models/Booking");
const MESSAGES = require("../utils/messages");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");

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
  if (isNaN(id)) {
    return { error: MESSAGES.GENERAL.INVALID_ID, status: 400 };
  }
  const cabin = await Cabin.findByPk(id);
  if (!cabin) {
    return { error: MESSAGES.CABIN.NOT_FOUND, status: 404 };
  }

  const newName = `${cabin.name} (Cópia)`;
  const nameExists = await Cabin.findOne({ where: { name: newName } });
  if (nameExists) {
    return { error: MESSAGES.CABIN.DUPLICATE_NAME, status: 409 };
  }

  const duplicatedCabin = await Cabin.create({
    name: newName,
    maxCapacity: cabin.maxCapacity,
    regularPrice: cabin.regularPrice,
    discount: cabin.discount,
    image: cabin.image,
    description: cabin.description,
  });

  return { cabin: duplicatedCabin };
}

async function updateCabin(
  id,
  { name, maxCapacity, regularPrice, discount, description, file }
) {
  if (isNaN(id)) {
    return { error: MESSAGES.GENERAL.INVALID_ID, status: 400 };
  }
  const existingCabin = await Cabin.findByPk(id);
  if (!existingCabin) {
    return { error: MESSAGES.CABIN.NOT_FOUND, status: 404 };
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
    return { error: MESSAGES.CABIN.NAME_EXISTS, status: 409 };
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

  return { success: true };
}

async function deleteCabin(id) {
  if (isNaN(id)) {
    return { error: MESSAGES.GENERAL.INVALID_ID, status: 400 };
  }
  const existingCabin = await Cabin.findByPk(id);
  if (!existingCabin) {
    return { error: MESSAGES.CABIN.NOT_FOUND, status: 404 };
  }
  const bookingsCount = await Booking.count({ where: { cabinId: id } });
  if (bookingsCount > 0) {
    return { error: MESSAGES.GENERAL.ASSOCIATED_BOOKINGS, status: 409 };
  }
  await Cabin.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  getCabinById,
  createCabin,
  duplicateCabin,
  updateCabin,
  deleteCabin,
};
