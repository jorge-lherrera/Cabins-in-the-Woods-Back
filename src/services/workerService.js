const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");
const findById = require("../utils/findById");
const MESSAGES = require("../utils/messages");
const updatedFields = require("../utils/updatedFields");

async function getWorkerById(id) {
  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
      status: 404,
    };
  }

  const workerObj = existingWorker.toJSON();
  delete workerObj.password;
  return { resource: workerObj, error: null, status: 200 };
}

async function createWorker(data) {
  const { name, email, password, file } = data;
  const avatarUrl = file ? await uploadFileCloudinary(file, "workers") : null;

  const existingWorker = await Worker.findOne({ where: { email } });
  if (existingWorker) {
    return {
      resource: null,
      error: MESSAGES.ALREADY_EXISTS("esse email"),
      status: 409,
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const worker = await Worker.create({
    name,
    email,
    avatar: avatarUrl,
    password: hashedPassword,
  });

  const workerObj = worker.toJSON();
  delete workerObj.password;
  return { resource: workerObj, error: null, status: 201 };
}

async function updateWorker(id, data) {
  const { name, email, password, currentPassword, file } = data;

  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
      status: 404,
    };
  }

  let avatarUrl = existingWorker.avatar;
  if (file) {
    avatarUrl = await uploadFileCloudinary(file, "workers");
  }

  if (email && email !== existingWorker.email) {
    const emailExists = await Worker.findOne({ where: { email } });
    if (emailExists) {
      return {
        resource: null,
        error: MESSAGES.ALREADY_EXISTS("esse email"),
        status: 409,
      };
    }
  }

  const fields = ["name", "email", "avatar"];

  const updatedData = updatedFields(data, fields);

  if (password !== undefined && password !== "") {
    if (!currentPassword) {
      return {
        resource: null,
        error: MESSAGES.WORKER.CURRENT_PASSWORD_REQUIRED,
        status: 400,
      };
    }
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      existingWorker.password
    );
    if (!isPasswordCorrect) {
      return {
        resource: null,
        error: MESSAGES.GENERAL.INVALID("Senha"),
        status: 401,
      };
    }
    updatedData.password = await bcrypt.hash(password, 10);
  }

  await Worker.update(updatedData, { where: { id } });
  const updatedWorker = await Worker.findByPk(id);

  const workerObj = updatedWorker.toJSON();
  delete workerObj.password;

  return { resource: workerObj, error: null, status: 200 };
}

async function deleteWorker(id) {
  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
      status: 404,
    };
  }

  await Worker.destroy({ where: { id } });
  return { resource: null, error: null, status: 200 };
}

module.exports = {
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
};
