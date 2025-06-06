const MESSAGES = {
  GENERAL: {
    SERVER_ERROR: "Erro interno do servidor.",
    VALIDATION_ERROR: "Erros de validação nos dados fornecidos.",

    INVALID: (resource) =>
      `${resource} fornecido é inválido. Verifique os dados.`,
    NOT_FOUND: (resource) => `${resource} não encontrado.`,
    ALREADY_EXISTS: (resource) =>
      `Já existe ${resource}. Por favor, escolha outro.`,
    ASSOCIATED: (resource) =>
      `Não é possível excluir o ${resource.toLowerCase()} porque existem registros associados.`,
    FOUND: (resource) => `${resource} encontrado com sucesso.`,

    CREATE_SUCCESS: (resource) => `${resource} criado com sucesso.`,
    UPDATE_SUCCESS: (resource) => `${resource} atualizado com sucesso.`,
    DELETE_SUCCESS: (resource) => `${resource} excluído com sucesso.`,
    CREATE_ERROR: (resource) => `Erro ao criar o ${resource.toLowerCase()}.`,
    UPDATE_ERROR: (resource) =>
      `Erro ao atualizar o ${resource.toLowerCase()}.`,
    DELETE_ERROR: (resource) => `Erro ao excluir o ${resource.toLowerCase()}.`,
  },

  BOOKING: {
    DUPLICATE_BOOKING:
      "Já existe uma reserva para esta cabana nas datas selecionadas.",
    SETTINGS_CONFIG:
      "A reserva não pode ser criada porque não cumpre a configuração do sistema.",
  },
  CABIN: {
    DUPLICATE_SUCCESS: "Cabana duplicada com sucesso.",
    DISCOUNT: "O desconto não pode ser maior que o preço.",
  },
  SETTINGS: {
    CONFIG_EXISTS:
      "Já existe uma configuração no sistema. Apenas atualizações são permitidas.",
  },
  WORKER: {
    CURRENT_PASSWORD_REQUIRED:
      "A senha atual é obrigatória para atualizar a senha.",
  },

  LOGIN: {
    LOGIN_SUCCESS: "Login realizado com sucesso.",
    LOGOUT_SUCCESS: "Logout realizado com sucesso.",
  },
};

module.exports = MESSAGES;
