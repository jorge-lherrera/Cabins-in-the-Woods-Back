const MESSAGES = {
  GENERAL: {
    SERVER_ERROR: "Erro interno do servidor.",
    VALIDATION_ERROR: "Erros de validação nos dados fornecidos.",
    INVALID_ID: "O ID deve ser um número válido.",
    NOT_FOUND: (resource) => `${resource} não encontrado.`,
    CREATE_SUCCESS: (resource) => `${resource} criado com sucesso.`,
    UPDATE_SUCCESS: (resource) => `${resource} atualizado com sucesso.`,
    DELETE_SUCCESS: (resource) => `${resource} excluído com sucesso.`,
    CREATE_ERROR: (resource) => `Erro ao criar o ${resource.toLowerCase()}.`,
    UPDATE_ERROR: (resource) =>
      `Erro ao atualizar o ${resource.toLowerCase()}.`,
    DELETE_ERROR: (resource) => `Erro ao excluir o ${resource.toLowerCase()}.`,
  },
  BOOKING: {
    INVALID_CABIN_OR_GUEST: "Cabana ou hóspede inválido.",
  },
  CABIN: {
    NAME_EXISTS: "O nome da cabana já existe. Por favor, escolha outro.",
    CREATE_ERROR: "Não foi possível efetuar o cadastro da cabana.",
  },
  SETTINGS: {
    CONFIG_EXISTS:
      "Já existe uma configuração no sistema. Apenas atualizações são permitidas.",
  },
  WORKER: {
    EMAIL_IN_USE: "O e-mail já está em uso.",
  },
  GUEST: {
    EMAIL_OR_ID_EXISTS: "O e-mail ou número de identificação já existe.",
  },
  LOGIN: {
    INVALID_CREDENTIALS: "Usuário não encontrado ou senha inválida.",
    LOGIN_SUCCESS: "Login realizado com sucesso. Token armazenado no cookie.",
  },
};

module.exports = MESSAGES;
