const bcrypt = require("bcrypt");
const Worker = require("../models/Worker");
const uploadFileCloudinary = require("../utils/uploadFileCloudinary");
const findById = require("../utils/findById");
const MESSAGES = require("../utils/messages");

async function getWorkerById(id) {
  const worker = await findById(Worker, id);
  if (!worker) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"), status: 404 };
  }
  return { worker };
}

async function createWorker({ name, email, password, file }) {
  const avatarUrl = await uploadFileCloudinary(file, "workers");

  const existingWorker = await Worker.findOne({ where: { email } });
  if (existingWorker) {
    return { error: MESSAGES.WORKER.EMAIL_IN_USE, status: 409 };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const worker = await Worker.create({
    name,
    email,
    avatar: avatarUrl,
    password: hashedPassword,
  });

  return { worker };
}

async function updateWorker(
  id,
  { name, email, password, currentPassword, file }
) {
  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"), status: 404 };
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
      return { error: MESSAGES.WORKER.INVALID_CURRENT_PASSWORD, status: 401 };
    }
  } else if (password && !currentPassword) {
    return {
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

  return { success: true, worker: updatedWorker };
}

async function deleteWorker(id) {
  const existingWorker = await findById(Worker, id);
  if (!existingWorker) {
    return { error: MESSAGES.GENERAL.NOT_FOUND("Funcionário"), status: 404 };
  }

  await Worker.destroy({ where: { id } });
  return { success: true };
}

module.exports = {
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
};