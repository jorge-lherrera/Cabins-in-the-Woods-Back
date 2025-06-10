const Setting = require("../models/Setting");
const MESSAGES = require("../utils/messages");
const updatedFields = require("../utils/updatedFields");

async function getUniqueSetting() {
  const setting = await Setting.findOne();
  if (!setting) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
      status: 404,
    };
  }

  const settingObj = setting.toJSON();
  return { resource: settingObj, error: null, status: 200 };
}

async function createUniqueSetting(data) {
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = data;

  const existingSetting = await Setting.findOne();

  if (existingSetting) {
    return {
      resource: null,
      error: MESSAGES.SETTINGS.CONFIG_EXISTS,
      status: 409,
    };
  }

  const setting = await Setting.create({
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  });

  const settingObj = setting.toJSON();

  return { resource: settingObj, error: null, status: 201 };
}

async function updateUniqueSetting(data) {
  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = data;

  const existingSetting = await Setting.findOne();

  if (!existingSetting) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
      status: 404,
    };
  }

  const fields = [
    "minBookingLength",
    "maxBookingLength",
    "maxGuestsPerBooking",
    "breakfastPrice",
  ];

  const combined = {
    ...existingSetting.toJSON(),
    ...updatedFields(data, fields),
  };

  if (
    combined.maxBookingLength !== undefined &&
    combined.minBookingLength !== undefined &&
    Number(combined.maxBookingLength) <= Number(combined.minBookingLength)
  ) {
    return {
      resource: null,
      error: "A duração máxima deve ser maior que a duração mínima.",
      status: 400,
    };
  }

  const updatedData = updatedFields(data, fields);

  await Setting.update(updatedData, { where: { id: existingSetting.id } });
  const updatedSetting = await Setting.findByPk(existingSetting.id);

  const settingObj = updatedSetting.toJSON();

  return { resource: settingObj, error: null, status: 200 };
}

module.exports = {
  getUniqueSetting,
  createUniqueSetting,
  updateUniqueSetting,
};
