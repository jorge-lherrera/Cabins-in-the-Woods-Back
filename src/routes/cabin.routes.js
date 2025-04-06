const { Router } = require("express");
const cabinRouter = new Router();
const CabinController = require("../controllers/CabinController");

cabinRouter.get("/", CabinController.list);
