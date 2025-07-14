# Cabins-in-the-Woods-Back

Backend para gestão de cabanas, hóspedes, reservas e funcionários. Projeto educacional e base para sistemas de administração de hospedagens turísticas.

## Para que serve?

Permite:

- Gerenciar cabanas e sua disponibilidade
- Registrar e administrar hóspedes
- Criar, atualizar e cancelar reservas
- Controlar funcionários e seus perfis
- Configurar regras do negócio (mínimo de noites, preços, etc)
- Fornecer uma API RESTful segura e documentada (Swagger) para consumo por frontend ou apps móveis

## Principais Tecnologias

- Node.js, Express
- Sequelize (PostgreSQL)
- JWT para autenticação
- Yup para validações
- Cloudinary para upload de imagens
- Swagger para documentação automática

## Instalação Rápida

1. Clone o repositório:
   ```bash
   git clone https://github.com/jorge-lherrera/Cabins-in-the-Woods-Back.git
   cd Cabins-in-the-Woods-Back
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o arquivo `.env` com seus dados de banco e chaves:
   ```env
   DIALECT=postgres
   HOST=localhost
   USERNAMEDB=postgres
   PASSWORDDB=postgres
   DATABASE=cabin in the woods-back
   PORT=5432
   PORT_API=3000
   SECRET_JWT=SENHA
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```
4. Execute as migrações e seeders se necessário.
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Documentação Interativa

Acesse a documentação Swagger em:

```
http://localhost:3000/docs
```

## Testes

Execute os testes com:

```bash
npm test
```

## Estrutura do Projeto

```
src/
  controllers/      # Lógica de negócio
  routes/           # Endpoints e documentação Swagger
  models/           # Modelos Sequelize
  services/         # Acesso a dados e regras de negócio
  middleware/       # Middlewares personalizados
  validations/      # Schemas Yup
  utils/            # Utilitários
  config/           # Configuração do banco
  database/         # Migrações e seeders
swagger.js          # Script para autogerar a documentação
```

## Possíveis Melhorias

- Papéis e permissões avançadas (admin, recepção, limpeza, etc)
- Notificações por e-mail ou push
- Integração com gateways de pagamento
- Histórico e auditoria de alterações
- Suporte multilíngue
- Otimização de consultas para grandes volumes
- Maior cobertura de testes
- Painel administrativo web avançado
- Melhorias na documentação e exemplos de uso
- Backup e restauração do banco de dados
