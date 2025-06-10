const Setting = require("../models/Setting");
const MESSAGES = require("../utils/messages");

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

async function updateUniqueSetting(id, data) {
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

  const updatedData = {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  };

  await Setting.update(updatedData, { where: { id } });
  const updatedSetting = await Setting.findByPk(id);

  const settingObj = updatedSetting.toJSON();

  return { resource: settingObj, error: null, status: 200 };
}

module.exports = {
  getUniqueSetting,
  createUniqueSetting,
  updateUniqueSetting,
};
