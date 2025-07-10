const workerService = require("../../src/services/workerService");
const { connection } = require("../../src/database/connection");
const Worker = require("../../src/models/Worker");
const bcrypt = require("bcrypt");

describe("workerService", () => {
  beforeAll(async () => {
    await connection.sync({ force: true });
  });

  afterAll(async () => {
    await connection.close();
  });

  it("should create a new worker", async () => {
    const result = await workerService.createWorker({
      name: "Funcionário Teste",
      email: "funcionario@email.com",
      password: "senha12345",
    });
    expect(result.resource).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.resource.name).toBe("Funcionário Teste");
  });

  it("should not create a worker with duplicate email", async () => {
    await workerService.createWorker({
      name: "Outro Funcionário",
      email: "duplicado@email.com",
      password: "senha12345",
    });
    const result = await workerService.createWorker({
      name: "Duplicado",
      email: "duplicado@email.com",
      password: "senha12345",
    });
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("should return error if worker not found", async () => {
    const result = await workerService.getWorkerById(9999);
    expect(result.error).toBeDefined();
    expect(result.error.errorCode).toBe("USUARIO_INVALIDO");
  });

  it("should update worker name", async () => {
    const create = await workerService.createWorker({
      name: "Para Atualizar",
      email: "atualizar@email.com",
      password: "senha12345",
    });
    const update = await workerService.updateWorker(create.resource.id, {
      name: "Atualizado",
      currentPassword: "senha12345",
    });
    expect(update.resource.name).toBe("Atualizado");
    expect(update.error).toBeNull();
  });

  it("should not update password without currentPassword", async () => {
    const create = await workerService.createWorker({
      name: "SemSenhaAtual",
      email: "semsenha@email.com",
      password: "senha12345",
    });
    const update = await workerService.updateWorker(create.resource.id, {
      password: "novaSenha123",
    });
    expect(update.error).toBeDefined();
    expect(update.error.errorCode).toBe("SENHA_INVALIDA");
  });

  it("should not update password with wrong currentPassword", async () => {
    const create = await workerService.createWorker({
      name: "SenhaErrada",
      email: "senhaerrada@email.com",
      password: "senha12345",
    });
    const update = await workerService.updateWorker(create.resource.id, {
      password: "novaSenha123",
      currentPassword: "errada",
    });
    expect(update.error).toBeDefined();
    expect(update.error.errorCode).toBe("SENHA_INVALIDA");
  });

  it("should delete a worker", async () => {
    const create = await workerService.createWorker({
      name: "Para Deletar",
      email: "deletar@email.com",
      password: "senha12345",
    });
    const del = await workerService.deleteWorker(create.resource.id);
    expect(del.error).toBeNull();
    expect(del.status).toBe(200);
    const check = await workerService.getWorkerById(create.resource.id);
    expect(check.error).toBeDefined();
    expect(check.error.errorCode).toBe("USUARIO_INVALIDO");
  });
});
