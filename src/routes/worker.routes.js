const { Router } = require("express");
const workerRoutes = new Router();
const WorkerController = require("../controllers/WorkerController");
const validate = require("../middleware/validationsYup");
const workerValidation = require("../validations/workerValidation");

workerRoutes.get("/:id", WorkerController.getWorkerById);
workerRoutes.post(
  "/",
  validate(workerValidation),
  WorkerController.createWorker
);
workerRoutes.put(
  "/:id",
  validate(workerValidation),
  WorkerController.updateWorker
);
workerRoutes.delete("/:id", WorkerController.deleteWorker);

module.exports = workerRoutes;
