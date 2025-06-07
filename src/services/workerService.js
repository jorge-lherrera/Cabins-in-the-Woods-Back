const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");
const findById = require("../utils/findById");
const MESSAGES = require("../utils/messages");

async function getWorkerById(id) {
  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return {
      resource: null,
      error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"),
      status: 404,
    };
  }
  return { resource: existingWorker, error: null, status: 200 };
}

async function createWorker(data) {
  const { name, email, password, file } = data;
  const avatarUrl = await uploadFileCloudinary(file, "workers");

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

  return { resource: worker, error: null, status: 201 };
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

  if (password && currentPassword) {
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      existingWorker.password
    );
    if (!isPasswordCorrect) {
      return { resource: null, error: MESSAGES.INVALID("Senha"), status: 401 };
    }
  } else if (password && !currentPassword) {
    return {
      resource: null,
      error: MESSAGES.WORKER.CURRENT_PASSWORD_REQUIRED,
      status: 400,
    };
  }

  const updatedData = { name, email, avatar: avatarUrl };
  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  await Worker.update(updatedData, { where: { id } });
  const updatedWorker = await Worker.findByPk(id);

  return { resource: updatedWorker, error: null, status: 200 };
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
