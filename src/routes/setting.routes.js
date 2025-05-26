const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");
const validate = require("../middleware/validationsYup");
const settingValidation = require("../validations/settingValidation");
const auth = require("../middleware/auth");

settingRoutes.get("/", auth, (req, res, next) =>
  SettingController.getSettings(req, res, next)
);
settingRoutes.post("/", validate(settingValidation), auth, (req, res, next) =>
  SettingController.createSetting(req, res, next)
);
settingRoutes.put("/", validate(settingValidation), auth, (req, res, next) =>
  SettingController.updateSetting(req, res, next)
);

module.exports = settingRoutes;
