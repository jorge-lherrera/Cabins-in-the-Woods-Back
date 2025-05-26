const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");
const validate = require("../middleware/validationsYup");
const settingValidation = require("../validations/settingValidation");
const auth = require("../middleware/auth");

settingRoutes.get("/", auth, SettingController.getSettings);
settingRoutes.post(
  "/",
  auth,
  validate(settingValidation),
  SettingController.createSetting
);
settingRoutes.put(
  "/",
  auth,
  validate(settingValidation),
  SettingController.updateSetting
);

module.exports = settingRoutes;
