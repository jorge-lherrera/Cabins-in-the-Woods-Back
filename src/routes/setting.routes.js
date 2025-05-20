const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");
const validate = require("../middleware/validationsYup");
const settingValidation = require("../validations/settingValidation");
const auth = require("../middleware/auth");

settingRoutes.get("/", auth, SettingController.getSettings);
settingRoutes.post(
  "/",
  validate(settingValidation),
  auth,
  SettingController.createSetting
);
settingRoutes.put(
  "/",
  validate(settingValidation),
  auth,
  SettingController.updateSetting
);

module.exports = settingRoutes;
