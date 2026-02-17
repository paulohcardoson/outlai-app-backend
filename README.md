# OutlAI Backend

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.6.1-black.svg)](https://www.fastify.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

Backend da aplicação OutlAI - Uma API RESTful moderna construída com TypeScript, Fastify e PostgreSQL para gerenciamento de despesas com inteligência artificial.

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Migrações de Banco de Dados](#migrações-de-banco-de-dados)
- [Testes](#testes)
- [Contribuindo](#contribuindo)

## 🎯 Sobre o Projeto

OutlAI Backend é uma API RESTful desenvolvida para gerenciar despesas pessoais com funcionalidades de autenticação, gerenciamento de usuários e integração com inteligência artificial (Google Gemini) para análise e categorização automática de despesas.

### Principais Funcionalidades

- 🔐 **Autenticação JWT** - Sistema completo de autenticação e autorização
- 👤 **Gerenciamento de Usuários** - CRUD completo de usuários
- 💰 **Gerenciamento de Despesas** - Criação, leitura, atualização e exclusão de despesas
- 🤖 **Integração com IA** - Uso do Google Gemini para análise inteligente
- 📧 **Sistema de E-mail** - Envio de e-mails transacionais (verificação, recuperação de senha)
- 🔄 **Cache com Redis** - Sistema de cache para otimização de performance
- 📚 **Documentação Swagger** - Documentação interativa da API
- 🐳 **Docker Support** - Configuração pronta para containers

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

### Core
- [TypeScript](https://www.typescriptlang.org/) - Linguagem principal
- [Node.js](https://nodejs.org/) - Runtime JavaScript
- [Fastify](https://www.fastify.io/) - Framework web de alta performance
- [Drizzle ORM](https://orm.drizzle.team/) - ORM TypeScript-first

### Banco de Dados
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Redis](https://redis.io/) - Cache em memória

### Autenticação & Segurança
- [JSON Web Token](https://jwt.io/) - Autenticação JWT
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Hash de senhas

### Integrações
- [@google/genai](https://ai.google.dev/) - Google Gemini AI
- [Nodemailer](https://nodemailer.com/) - Envio de e-mails
- [Mailgun](https://www.mailgun.com/) - Serviço de e-mail

### Injeção de Dependências
- [TSyringe](https://github.com/microsoft/tsyringe) - Container de injeção de dependências

### Validação & Documentação
- [Zod](https://zod.dev/) - Validação de schema TypeScript-first
- [Swagger](https://swagger.io/) - Documentação da API

### Desenvolvimento
- [Jest](https://jestjs.io/) - Framework de testes
- [Biome](https://biomejs.dev/) - Linter e formatter
- [tsx](https://github.com/esbuild-kit/tsx) - TypeScript executor
- [Docker](https://www.docker.com/) - Containerização

## 📦 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (para executar os serviços)
- [Git](https://git-scm.com/)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/paulohcardoson/outlai-app-backend.git
cd outlai-app-backend
```

2. Instale as dependências:
```bash
pnpm install
```

## ⚙️ Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .template.env .env
```

2. Preencha as variáveis de ambiente no arquivo `.env` com as informações pendentes:

## 🚀 Executando o Projeto

1. Inicie os serviços (PostgreSQL e Redis):
```bash
docker compose up -d
```

2. Execute as migrações do banco de dados:
```bash
pnpm drizzle-kit push
```

3. Inicie o servidor de desenvolvimento:
```bash
pnpm dev:start
```

O servidor estará disponível em `http://localhost:3000`

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev:start          # Inicia o servidor em modo de desenvolvimento com hot-reload

# Build
pnpm build              # Compila o projeto para produção
pnpm copy:templates     # Copia templates de e-mail para dist

# Produção
pnpm start              # Inicia o servidor em modo de produção

# Testes
pnpm test               # Executa os testes com Jest

# Banco de Dados (Drizzle Kit)
pnpm drizzle-kit push   # Aplica as migrações ao banco de dados
pnpm drizzle-kit studio # Abre o Drizzle Studio para visualizar o banco
```

## 📁 Estrutura do Projeto

```
outlai-app-backend/
├── src/
│   ├── api/                    # Configuração da API
│   │   ├── v1/                 # Versão 1 da API
│   │   └── index.ts            # Ponto de entrada da aplicação
│   │
│   ├── features/               # Features/Módulos da aplicação
│   │   ├── auth/               # Autenticação e autorização
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── schemas/
│   │   │
│   │   ├── users/              # Gerenciamento de usuários
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── schemas/
│   │   │
│   │   └── expenses/           # Gerenciamento de despesas
│   │       ├── expenses.controller.ts
│   │       ├── expenses.service.ts
│   │       ├── expenses.routes.ts
│   │       └── schemas/
│   │
│   └── shared/                 # Código compartilhado
│       ├── config/             # Configurações (DB, env, etc)
│       │   └── db/
│       │       ├── index.ts
│       │       └── schema.ts   # Schema do banco de dados
│       ├── consts/             # Constantes
│       ├── errors/             # Classes de erro customizadas
│       ├── hooks/              # Hooks do Fastify
│       ├── providers/          # Providers (Email, Cache, IA)
│       ├── types/              # Tipos TypeScript compartilhados
│       ├── utils/              # Funções utilitárias
│       └── views/              # Templates de e-mail
│
├── tests/                      # Testes automatizados
├── drizzle/                    # Migrações do banco de dados
├── dist/                       # Build de produção
├── .template.env               # Exemplo de variáveis de ambiente
├── compose.yaml                # Docker Compose config
├── drizzle.config.ts           # Configuração do Drizzle ORM
├── jest.config.mjs             # Configuração do Jest
├── biome.json                  # Configuração do Biome
├── tsconfig.json               # Configuração do TypeScript
└── package.json                # Dependências e scripts
```

## 📖 Documentação da API

A documentação interativa da API está disponível através do Swagger UI após iniciar o servidor:

```
http://localhost:3000/docs
```

### Principais Endpoints

#### Autenticação
- `POST /api/v1/auth/register` - Registrar novo usuário
- `POST /api/v1/auth/login` - Fazer login
- `POST /api/v1/auth/logout` - Fazer logout
- `POST /api/v1/auth/verify-email` - Verificar e-mail
- `POST /api/v1/auth/forgot-password` - Solicitar recuperação de senha
- `POST /api/v1/auth/reset-password` - Redefinir senha

#### Usuários
- `GET /api/v1/users/me` - Obter dados do usuário autenticado
- `PUT /api/v1/users/me` - Atualizar dados do usuário
- `DELETE /api/v1/users/me` - Deletar conta

#### Despesas
- `GET /api/v1/expenses` - Listar todas as despesas
- `GET /api/v1/expenses/:id` - Obter uma despesa específica
- `POST /api/v1/expenses` - Criar nova despesa
- `PUT /api/v1/expenses/:id` - Atualizar despesa
- `DELETE /api/v1/expenses/:id` - Deletar despesa

#### Health Check
- `GET /health` - Verificar status da API

## 🗃️ Migrações de Banco de Dados

O projeto usa Drizzle ORM para gerenciar o schema do banco de dados.

### Aplicar Migrações

```bash
pnpm drizzle-kit push
```

### Visualizar Banco de Dados

```bash
pnpm drizzle-kit studio
```

Isso abrirá o Drizzle Studio no navegador (geralmente em `https://local.drizzle.studio`) onde você pode visualizar e editar os dados do banco.

## 🧪 Testes

Execute os testes com:

```bash
pnpm test
```

Para executar os testes em modo watch:

```bash
pnpm test -- --watch
```

Para executar com cobertura:

```bash
pnpm test -- --coverage
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

Este projeto utiliza:
- **Biome** para linting e formatação
- **TypeScript** com strict mode
- **Conventional Commits** para mensagens de commit

Execute o linter antes de commitar:
```bash
pnpm biome check --write
```

## 📄 Licença

Este projeto é open source.

## 👨‍💻 Autor

**Paulo Cardoso**
- GitHub: [@paulohcardoson](https://github.com/paulohcardoson)

---

Desenvolvido com ❤️ por [Paulo Cardoso](https://github.com/paulohcardoson)
