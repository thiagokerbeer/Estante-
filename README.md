<div align="center">

# Estante+

**Catálogo de livros com planos Free e Plus, autenticação JWT e API REST — do zero ao deploy em produção.**

[![Demo](https://img.shields.io/badge/demo-estante--wine.vercel.app-4f46e5?style=flat-square&logo=vercel)](https://estante-wine.vercel.app)
[![API](https://img.shields.io/badge/api-onrender.com-46a758?style=flat-square&logo=render)](https://estante-plus-api.onrender.com/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[**Ver demo ao vivo →**](https://estante-wine.vercel.app)&nbsp;&nbsp;&nbsp;[**API health →**](https://estante-plus-api.onrender.com/health)&nbsp;&nbsp;&nbsp;[**Código →**](https://github.com/thiagokerbeer/Estante-)

</div>

---

## Sobre o projeto

O **Estante+** é uma aplicação web full-stack construída para portfólio — pensada para ir além do CRUD básico e demonstrar decisões reais de produto, segurança e operação.

A proposta: um catálogo de livros com dois planos, como um Spotify para leitores. Usuários **Free** veem o catálogo mas têm acesso bloqueado aos títulos premium. Usuários **Plus** desbloqueiam tudo — sinopses completas e livros exclusivos.

Cada decisão técnica foi tomada como se o sistema fosse para produção: autenticação com defesa contra timing attack, CORS restrito por origem, graceful shutdown, migrations versionadas e deploy com infra como código.

> **Contas de demonstração**
>
> | Conta | E-mail | Senha | Plano |
> |-------|--------|-------|-------|
> | Free | `demo.free@estante.plus` | `DemoEstante!24` | Acesso básico |
> | Plus | `demo.plus@estante.plus` | `DemoEstante!24` | Acesso completo |

---

## Funcionalidades

### Produto
- Catálogo com 32 títulos, busca por nome/autor, filtro por plano e ordenação
- Página de detalhes com capa real (Open Library Covers API) e sinopse completa
- Livros premium bloqueados para usuários sem plano ativo — com paywall elegante
- Fluxo completo de assinatura e cancelamento (simulado, sem gateway real)
- Banner de cookies e página de privacidade (LGPD em modo demonstração)

### Autenticação e autorização
- Cadastro com validação de e-mail e senha, aceite de política de privacidade
- Login com JWT — token Bearer no header `Authorization`
- Middleware de sessão que popula `req.sessionUser` uma única vez (sem queries redundantes)
- Rota `/auth/me` para dados do usuário autenticado
- Export e exclusão de conta (`/auth/data-export`, `/auth/delete-account`)

### Operação
- `GET /health` com versão, ambiente e uptime em segundos
- Logging de requisições (`METHOD /path → status (Xms)`) configurável por ambiente
- Graceful shutdown em `SIGTERM`/`SIGINT` — desconecta Prisma antes de encerrar
- Blueprint `render.yaml` para deploy da API com um clique

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js 20+, Express 4, TypeScript, Prisma 6 |
| **Banco de dados** | PostgreSQL 16 — Neon (produção) · Docker (local) |
| **Autenticação** | bcryptjs · jsonwebtoken (HS256) |
| **Segurança HTTP** | Helmet · CORS configurável · express-rate-limit |
| **Deploy** | Vercel (frontend) · Render (API) · Neon (banco) |
| **Qualidade** | TypeScript strict · `noImplicitReturns` · `forceConsistentCasingInFileNames` |

---

## Arquitetura

```
┌────────────────────────────┐          HTTPS           ┌────────────────────────────┐
│         Vercel             │  ─────────────────────►  │      Render (Node.js)      │
│  estante-wine.vercel.app   │       VITE_API_URL        │   estante-plus-api         │
│                            │                           │                            │
│  React SPA (build estático)│                           │  Express + Prisma          │
│  React Router (client-side)│                           │  Graceful shutdown         │
│  Tailwind CSS              │                           │  Rate limiting por rota    │
└────────────────────────────┘                           └──────────────┬─────────────┘
                                                                        │
                                                                DATABASE_URL (SSL)
                                                                        │
                                                                        ▼
                                                         ┌──────────────────────────┐
                                                         │   Neon (PostgreSQL 16)   │
                                                         │   Serverless + pooling   │
                                                         └──────────────────────────┘
```

**Em desenvolvimento**, o Vite faz proxy de `/api` → `http://localhost:3001`. O frontend não precisa de CORS local nem de URL absoluta configurada.

---

## Estrutura do repositório

```
estante-plus/
├── frontend/                      # SPA React → deploy na Vercel
│   ├── src/
│   │   ├── api/client.ts          # Cliente HTTP com tratamento de erro e fallback JSON
│   │   ├── context/AuthContext.tsx # Estado global de sessão (JWT + usuário)
│   │   ├── pages/                 # CatalogPage, BookPage, LoginPage, PricingPage…
│   │   └── components/            # Layout, CookieBanner, skeletons, UI primitives
│   ├── vite.config.ts             # Proxy /api → localhost:3001 em dev
│   └── vercel.json                # Rewrite /* → /index.html (SPA routing)
│
├── backend/                       # API REST → deploy no Render
│   ├── src/
│   │   ├── index.ts               # Express, middlewares globais, graceful shutdown
│   │   ├── routes/                # auth.ts · books.ts · subscription.ts · legal.ts
│   │   ├── middleware/auth.ts     # JWT decode + req.sessionUser
│   │   └── lib/
│   │       ├── validation.ts      # Email, senha e ID validados antes do banco
│   │       ├── cors.ts            # CORS dinâmico por FRONTEND_URL
│   │       ├── security.ts        # Validação do JWT_SECRET + aviso de CORS em produção
│   │       └── prisma.ts          # PrismaClient singleton com log por ambiente
│   └── prisma/
│       ├── schema.prisma          # User (FREE|PLUS) · Book (isPremium)
│       ├── migrations/            # Migrations versionadas no repositório
│       └── seed.ts                # 32 livros + 2 contas demo
│
├── docker-compose.yml             # Postgres 16 local
├── render.yaml                    # Blueprint Render (infra como código)
└── DEPLOY.md                      # Passo a passo detalhado Neon + Render + Vercel
```

---

## Decisões técnicas relevantes

### Timing-safe login
Quando um e-mail não existe, o bcrypt roda um hash dummy fixo antes de retornar o erro. Isso impede que atacantes descubram usuários cadastrados medindo o tempo de resposta entre *"e-mail não encontrado"* e *"senha incorreta"*.

### `req.sessionUser` no middleware
O middleware de autenticação busca o usuário no banco uma única vez e anexa ao objeto `req`. Nenhuma rota subsequente (`/auth/me`, `/books/:id`, `/subscription`) precisa de um segundo `findUnique`.

### Validação de entrada centralizada
`backend/src/lib/validation.ts` — e-mail normalizado (lowercase + trim), senha com mínimo de 8 e máximo de 72 caracteres (limite físico do bcrypt), `id` de livro com formato validado antes de qualquer query.

### Limite de tamanho no JWT
O header `Authorization` tem um teto de caracteres checado antes do parse. Previne vetores de ataque baseados em tokens gigantes que seriam processados pelo jsonwebtoken.

### CORS dinâmico por variável de ambiente
`FRONTEND_URL` aceita múltiplas origens separadas por vírgula. Em desenvolvimento, `localhost:5173` é liberado automaticamente. Em produção, só a origem exata da Vercel passa — sem wildcard `*`.

### Build com `devDependencies` no Render
Com `NODE_ENV=production`, o `npm ci` pula `devDependencies` — incluindo TypeScript e todos os `@types/*`. O `buildCommand` usa `npm ci --include=dev` para garantir que o TypeScript compila corretamente antes de remover as dev deps no runtime.

---

## Segurança

| Camada | O que foi feito |
|--------|----------------|
| **Senhas** | bcrypt com salt rounds 10; mín. 8 / máx. 72 chars; hash dummy no login |
| **JWT** | HS256; limite de tamanho no header; `userId` validado antes de usar |
| **Inputs** | E-mail, senha e `id` de livro validados antes de qualquer query |
| **HTTP** | Helmet (`frameguard`, `referrerPolicy`); CORS restrito por origem |
| **Rate limiting** | Limites distintos por grupo: auth (restrito) · leitura (amplo) · assinatura (médio) |
| **Processo** | Graceful shutdown — Prisma desconecta antes do processo encerrar |
| **Segredos** | Nenhum segredo no repositório; aviso em log se `FRONTEND_URL` não estiver definido em produção |

---

## Rodando localmente

**Pré-requisitos:** Node.js 20+, Docker

```bash
# 1. Sobe o PostgreSQL local
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run db:seed
npm run dev          # API em http://localhost:3001

# 3. Frontend (outro terminal)
cd frontend
cp .env.example .env.local
npm ci
npm run dev          # App em http://localhost:5173
```

> Em dev, `VITE_API_URL` pode ficar vazio — o Vite faz proxy de `/api` para `localhost:3001` automaticamente.

### Comandos úteis

| Diretório | Comando | O que faz |
|-----------|---------|-----------|
| `backend` | `npm run dev` | API com hot-reload (`tsx watch`) |
| `backend` | `npm run build` | Prisma generate + `tsc` → `dist/` |
| `backend` | `npm run start` | Inicia build de produção |
| `backend` | `npm run db:seed` | Recria os 32 livros e contas demo |
| `frontend` | `npm run dev` | Dev server Vite |
| `frontend` | `npm run build` | Typecheck + bundle de produção |

---

## Variáveis de ambiente

### Backend — `backend/.env` (referência: `backend/.env.example`)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL |
| `JWT_SECRET` | ✅ | Mínimo 32 caracteres em produção |
| `FRONTEND_URL` | ✅ prod | URL exata da Vercel para CORS |
| `PORT` | — | Porta da API (padrão `3001`) |
| `CORS_ALLOW_VERCEL_PREVIEWS` | — | `1` para liberar `*.vercel.app` |
| `NODE_ENV` | — | `development` \| `production` |

### Frontend — Vercel Environment Variables

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | ✅ prod | URL da API no Render, sem barra final |

> ⚠️ Variáveis `VITE_*` são embutidas no bundle durante o **build**. Definir na Vercel exige um redeploy para ter efeito.

---

## API — endpoints

```
GET  /health                          → status, versão, uptime

POST /auth/register                   → cria conta
POST /auth/login                      → retorna JWT
GET  /auth/me               🔒        → dados do usuário autenticado
GET  /auth/data-export      🔒        → exporta dados (LGPD)
DELETE /auth/delete-account 🔒        → exclui conta

GET  /books                 🔓/🔒     → lista catálogo (auth opcional)
GET  /books/:id             🔓/🔒     → detalhe do livro (sinopse bloqueada se premium)

POST /subscription/subscribe  🔒      → ativa plano Plus (demo)
POST /subscription/cancel     🔒      → cancela plano Plus (demo)

GET  /legal/privacy-notice            → texto de privacidade estruturado
```

🔒 Requer `Authorization: Bearer <token>` &nbsp;|&nbsp; 🔓 Funciona sem token (comportamento adaptado)

---

## Deploy

Passo a passo completo em **[DEPLOY.md](./DEPLOY.md)**. Resumo em 3 passos:

```
1. Neon     → criar projeto PostgreSQL, copiar connection string
2. Render   → New Blueprint → conectar repo → definir DATABASE_URL e FRONTEND_URL
3. Vercel   → importar repo → root directory: frontend → definir VITE_API_URL
```

O `render.yaml` na raiz do repositório define o serviço, as variáveis e os comandos de build/start. O Render executa `prisma migrate deploy` e `tsx prisma/seed.ts` automaticamente no primeiro deploy.

---

## Autor

**Thiago Kerbeer**

[![GitHub](https://img.shields.io/badge/GitHub-thiagokerbeer-181717?style=flat-square&logo=github)](https://github.com/thiagokerbeer)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-thiago--kerbeer-0077b5?style=flat-square&logo=linkedin)](https://linkedin.com/in/thiago-kerbeer)

---

<div align="center">

Código disponível para estudo e portfólio. Se reutilizar trechos, adapte os segredos e URLs ao seu ambiente.

</div>
