const { Router } = require("express");
const settingRoutes = new Router();
const SettingController = require("../controllers/SettingController");

settingRoutes.get("/", SettingController.getAllSettings);
settingRoutes.post("/", SettingController.createSetting);
settingRoutes.put("/:id", SettingController.updateSetting);

module.exports = settingRoutes;
