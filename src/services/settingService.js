const Setting = require("../models/Setting");

const SETTING_ERRORS = {
  EXISTS: "SETTING_ALREADY_EXISTS",
  NOT_FOUND: "SETTING_NOT_FOUND",
};

async function getUniqueSetting() {
  return await Setting.findOne();
}

async function createUniqueSetting(data) {
  const existing = await Setting.findOne();
  if (existing) throw new Error(SETTING_ERRORS.EXISTS);
  return await Setting.create(data);
}

async function updateUniqueSetting(data) {
  const existing = await Setting.findOne();
  if (!existing) throw new Error(SETTING_ERRORS.NOT_FOUND);
  await Setting.update(data, { where: { id: existing.id } });
  return true;
}

module.exports = {
  getUniqueSetting,
  createUniqueSetting,
  updateUniqueSetting,
  SETTING_ERRORS,
};
