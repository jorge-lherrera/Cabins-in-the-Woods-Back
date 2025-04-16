const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");

settingRoutes.get("/", SettingController.getSettings);
settingRoutes.post("/", SettingController.createSetting);
settingRoutes.put("/", SettingController.updateSetting);

module.exports = settingRoutes;
