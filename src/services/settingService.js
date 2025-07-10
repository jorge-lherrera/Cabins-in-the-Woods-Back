const Setting = require("../models/Setting");
const MESSAGES = require("../utils/messages");
const updatedFields = require("../utils/updatedFields");

async function getUniqueSetting() {
  const setting = await Setting.findOne();

  if (!setting) {
    return {
      resource: null,
      error: {
        status: 404,
        errorCode: "SETTING_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
        source: "settingService.getUniqueSetting",
        detalhes: null,
      },
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
      error: {
        status: 409,
        errorCode: "SETTING_ALREADY_EXISTS",
        message: MESSAGES.SETTINGS.CONFIG_EXISTS,
        source: "settingService.createUniqueSetting",
        detalhes: null,
      },
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
      error: {
        status: 404,
        errorCode: "SETTING_NOT_FOUND",
        message: MESSAGES.GENERAL.NOT_FOUND("Configuração"),
        source: "settingService.updateUniqueSetting",
        detalhes: null,
      },
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
      error: {
        status: 400,
        errorCode: "INVALID_BOOKING_LENGTH",
        message: "A duração máxima deve ser maior que a duração mínima.",
        source: "settingService.updateUniqueSetting",
        detalhes: {
          minBookingLength: combined.minBookingLength,
          maxBookingLength: combined.maxBookingLength,
        },
      },
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
