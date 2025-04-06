const { Router } = require("express");
const workerRoutes = new Router();
const WorkerController = require("../controllers/WorkerController");

workerRoutes.get("/:id", WorkerController.getWorkerById);
workerRoutes.post("/", WorkerController.createWorker);
workerRoutes.put("/:id", WorkerController.updateWorker);
workerRoutes.delete("/:id", WorkerController.deleteWorker);

module.exports = workerRoutes;
