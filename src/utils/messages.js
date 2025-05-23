const MESSAGES = {
  GENERAL: {
    SERVER_ERROR: "Erro interno do servidor.",
    VALIDATION_ERROR: "Erros de validação nos dados fornecidos.",
    INVALID_ID: "O ID deve ser um número válido.",
    INVALID_DATE: "Data inválida.",
    NOT_FOUND: (resource) => `${resource} não encontrado.`,
    CREATE_SUCCESS: (resource) => `${resource} criado com sucesso.`,
    UPDATE_SUCCESS: (resource) => `${resource} atualizado com sucesso.`,
    DELETE_SUCCESS: (resource) => `${resource} excluído com sucesso.`,
    CREATE_ERROR: (resource) => `Erro ao criar o ${resource.toLowerCase()}.`,
    UPDATE_ERROR: (resource) =>
      `Erro ao atualizar o ${resource.toLowerCase()}.`,
    DELETE_ERROR: (resource) => `Erro ao excluir o ${resource.toLowerCase()}.`,
    ASSOCIATED_BOOKINGS:
      "Não é possível excluir o hóspede porque existem reservas associadas.",
    NO_STAYS_FOUND: "Nenhuma estadia encontrada para a data indicada.",
    NO_BOOKINGS_FOUND: "Nenhuma reserva encontrada para a data indicada.",
  },
  BOOKING: {
    INVALID_CABIN_OR_GUEST: "Cabana ou hóspede inválido.",
    DUPLICATE_BOOKING:
      "Já existe uma reserva para esta cabana nas datas selecionadas.",
  },
  CABIN: {
    NAME_EXISTS: "O nome da cabana já existe. Por favor, escolha outro.",
    CREATE_ERROR: "Não foi possível efetuar o cadastro da cabana.",
    NOT_FOUND: "Cabana não encontrada.",
    DUPLICATE_NAME: "Já existe uma cabana duplicada com esse nome.",
    DUPLICATE_SUCCESS: "Cabana duplicada com sucesso.",
    CREATE_SUCCESS: "Cabana criada com sucesso.",
    UPDATE_SUCCESS: "Cabana atualizada com sucesso.",
    DELETE_SUCCESS: "Cabana excluída com sucesso.",
  },
  SETTINGS: {
    CONFIG_EXISTS:
      "Já existe uma configuração no sistema. Apenas atualizações são permitidas.",
  },
  WORKER: {
    EMAIL_IN_USE: "O e-mail já está em uso.",
    INVALID_CURRENT_PASSWORD: "A senha atual está incorreta.",
    CURRENT_PASSWORD_REQUIRED:
      "A senha atual é obrigatória para atualizar a senha.",
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
