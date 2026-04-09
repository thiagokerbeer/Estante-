# Estante+

Aplicação web de **catálogo de livros** com **planos Free e Plus** (demonstração), autenticação por **JWT**, API REST em **Node** e interface em **React**. Projeto pensado para **portfólio**: mostra separação front/back, PostgreSQL em produção, segurança básica (CORS, rate limit, Helmet) e fluxo de "assinatura" simulado com livros premium bloqueados para quem não está no Plus.

| | |
|---|---|
| **Demo ao vivo** | [estante-wine.vercel.app](https://estante-wine.vercel.app) |
| **API** | [estante-plus-api.onrender.com](https://estante-plus-api.onrender.com) |
| **Repositório** | [github.com/thiagokerbeer/Estante-](https://github.com/thiagokerbeer/Estante-) |

> **Contas de teste:** `demo.free@estante.plus` / `demo.plus@estante.plus` — senha `DemoEstante!24`

---

## O que o projeto demonstra

- **Monorepo** com `frontend` (SPA) e `backend` (API), sem framework full-stack único — deploy independente (Vercel + Render).
- **Autenticação real** (cadastro/login, hash de senha, sessão via Bearer token).
- **Autorização por plano**: catálogo e fichas de livro adaptam o que o usuário pode ver (livros premium "trancados" sem Plus ativo).
- **Persistência** com **Prisma** e **PostgreSQL** (migrations versionadas; banco gerenciado no Neon em produção).
- **Experiência de produto**: home, catálogo, página do livro, preços/assinatura (rota privada), privacidade (LGPD em modo demonstração), banner de cookies.
- **Operação**: health check (`/health`), graceful shutdown (SIGTERM/SIGINT), logging de requisições por ambiente, `render.yaml` Blueprint para deploy com um clique.
- **Portfólio-ready**: seção "Stack técnica" visível na home, link GitHub no footer, meta tags Open Graph no `index.html`, capas reais dos livros via Unsplash.

---

## Stack

| Camada | Tecnologias |
|--------|----------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js 20+, Express 4, TypeScript, Prisma 6 |
| **Banco** | PostgreSQL 16 (Neon em produção, Docker local) |
| **Auth** | bcryptjs, jsonwebtoken |
| **Segurança / HTTP** | Helmet, CORS configurável, express-rate-limit |
| **Deploy** | Vercel (front) · Render (API) · Neon (banco) |

---

## Arquitetura

```text
┌──────────────────────┐     HTTPS      ┌───────────────────────┐
│  Vercel              │  ───────────►  │  Render (Node.js)     │
│  estante-wine.vercel │   VITE_API_URL │  estante-plus-api     │
└──────────────────────┘                └──────────┬────────────┘
                                                   │
                                                   │ DATABASE_URL
                                                   ▼
                                        ┌──────────────────────┐
                                        │  Neon (PostgreSQL)   │
                                        └──────────────────────┘
```

Em **desenvolvimento**, o Vite faz proxy de `/api` → `http://localhost:3001` automaticamente.

---

## Estrutura do repositório

```text
.
├── frontend/          # SPA React (build estático → Vercel)
├── backend/           # API Express + Prisma (→ Render)
├── docker-compose.yml # Postgres local para desenvolvimento
├── render.yaml        # Blueprint Render (deploy com um clique)
├── DEPLOY.md          # Passo a passo completo de deploy
└── README.md
```

Principais entradas:

- **API:** `backend/src/index.ts` — rotas `/auth`, `/books`, `/subscription`, `/legal`, `/health`.
- **Validação:** `backend/src/lib/validation.ts` — e-mail, senha e `id` de livro validados antes de ir ao banco.
- **Modelos:** `backend/prisma/schema.prisma` — `User` (plano `FREE` | `PLUS`), `Book` (`isPremium`).
- **Seed:** `backend/prisma/seed.ts` — catálogo e contas demo.
- **Front:** `frontend/src/App.tsx` — rotas; `frontend/src/api/client.ts` — cliente HTTP.

---

## Pré-requisitos

- **Node.js 20+** ([nodejs.org](https://nodejs.org/))
- **Docker** (para Postgres local)
- Para deploy: contas no [Neon](https://neon.tech), [Render](https://render.com) e [Vercel](https://vercel.com)

---

## Como rodar localmente

### 1. Postgres com Docker

```bash
# Na raiz do projeto
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm ci
npx prisma migrate deploy
npm run db:seed
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# VITE_API_URL pode ficar vazio em dev — o Vite usa proxy para /api
npm ci
npm run dev
```

Acesse `http://localhost:5173`.

### Scripts úteis

| Pasta | Comando | Descrição |
|--------|---------|-----------|
| `backend` | `npm run dev` | API com reload (`tsx watch`) |
| `backend` | `npm run build` | Gera Prisma Client + `tsc` → `dist/` |
| `backend` | `npm run start` | Produção: `node dist/index.js` |
| `backend` | `npm run db:seed` | Repopula dados de demonstração |
| `frontend` | `npm run dev` | Servidor Vite |
| `frontend` | `npm run build` | Typecheck + bundle para produção |

---

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Neon em produção, Docker local) |
| `JWT_SECRET` | Segredo para assinar JWT — mín. 32 chars em produção |
| `FRONTEND_URL` | URL exata da Vercel (CORS) — várias separadas por vírgula |
| `PORT` | Porta da API (padrão `3001`) |
| `CORS_ALLOW_VERCEL_PREVIEWS` | Opcional: `1` para liberar previews `*.vercel.app` |

### Frontend (Vercel)

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL da API no Render, sem barra no final |

---

## API — endpoints

| Grupo | Rota | Notas |
|-------|------|-------|
| Saúde | `GET /health` | Retorna uptime, versão e env |
| Auth | `POST /auth/register` `POST /auth/login` `GET /auth/me` | JWT Bearer |
| Livros | `GET /books` `GET /books/:id` | Auth opcional; premium trancado sem Plus |
| Assinatura | `POST /subscription/subscribe` `POST /subscription/cancel` | Demo sem gateway |
| Legal | `GET /legal/privacy-notice` | LGPD estruturado em JSON |

Rate limiting aplicado por grupo de rotas.

---

## Deploy

Passo a passo completo em **[DEPLOY.md](./DEPLOY.md)**. Resumo:

1. Criar banco no **Neon** e copiar a connection string.
2. No **Render**: New → Blueprint → conectar repo → definir `DATABASE_URL` e `FRONTEND_URL` no painel.
3. Na **Vercel**: importar repo → Root Directory `frontend` → definir `VITE_API_URL`.

---

## Segurança

- Senhas com **bcrypt** (mín. 8 / máx. 72 chars); hash dummy no login para evitar timing attack por e-mail inexistente.
- **JWT HS256** com limite de tamanho no header `Authorization`.
- **Helmet** (`frameguard`, `referrerPolicy`), **CORS** restrito por origem, **rate limiting** separado por grupo de rotas.
- Validação de formato em todos os inputs antes de consultar o banco.
- Graceful shutdown no SIGTERM — conexões finalizadas antes de encerrar o processo.
- Fluxo de assinatura **simulado** (sem gateway real) — adequado para portfólio.

---

## Autor

**Thiago Kerbeer** — [github.com/thiagokerbeer](https://github.com/thiagokerbeer)
