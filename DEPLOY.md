# Deploy: Neon (banco) + Render (API) + Vercel (front)

Stack de produção: banco PostgreSQL gerenciado no **Neon**, API Node no **Render** (free), SPA React na **Vercel** (free).

URLs em produção: **API** → https://estante-plus-api.onrender.com · **Front** → https://estante-wine.vercel.app

---

## 1. Banco — Neon

1. Acesse [neon.tech](https://neon.tech) e crie um projeto (free tier).
2. Na aba **Connection Details**, copie a **connection string** (formato pooler):
   ```
   postgresql://user:senha@ep-xxx-pooler.região.aws.neon.tech/neondb?sslmode=require
   ```
3. Guarde essa string — você vai colá-la no Render a seguir.

> **Nunca suba a connection string para o repositório.** Ela contém usuário e senha do banco.

---

## 2. API — Render (Blueprint)

### 2a. Criar o serviço via Blueprint

1. No [Render Dashboard](https://dashboard.render.com), clique em **New → Blueprint**.
2. Conecte o repositório `thiagokerbeer/Estante-` (autorize o GitHub se necessário).
3. O Render detecta o `render.yaml` automaticamente. Clique em **Apply**.
4. O serviço `estante-plus-api` será criado com `JWT_SECRET` gerado automaticamente.

### 2b. Definir as variáveis que ficaram como `sync: false`

No painel do serviço `estante-plus-api` → **Environment**:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Connection string copiada do Neon (passo 1) |
| `FRONTEND_URL` | URL da Vercel — preencher **após** criar o projeto lá (passo 3) |

Clique em **Save Changes** → o Render faz redeploy automático.

### 2c. Acompanhar o build

O build roda:
```
npm ci && npm run build && npx prisma migrate deploy && npx tsx prisma/seed.ts
```

- `prisma migrate deploy` — aplica as migrations no Neon.
- `prisma/seed.ts` — popula o catálogo e cria as contas demo.

Aguarde o status ficar **Live**. Anote a URL pública da API:
```
https://estante-plus-api.onrender.com   ← exemplo
```

---

## 3. Frontend — Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New Project** → importe o repositório `thiagokerbeer/Estante-`.
2. Em **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
3. Em **Environment Variables** (antes de fazer deploy):

| Variável | Valor |
|----------|-------|
| `VITE_API_URL` | URL da API no Render **sem barra no final** (ex.: `https://estante-plus-api.onrender.com`) |

4. Clique em **Deploy**.
5. Após o deploy, copie a URL gerada (ex.: `https://estante-plus.vercel.app`).

---

## 4. Conectar front ↔ back (CORS)

Volte ao Render → serviço `estante-plus-api` → **Environment**:

| Variável | Valor |
|----------|-------|
| `FRONTEND_URL` | URL exata da Vercel (ex.: `https://estante-plus.vercel.app`) |

Salve → redeploy automático. O CORS passa a aceitar requisições da Vercel.

> Para liberar previews automáticos (`*.vercel.app`) sem listar cada URL, adicione também:
> `CORS_ALLOW_VERCEL_PREVIEWS` = `1`

---

## 5. Contas de demonstração

Após o seed rodar no primeiro deploy:

| Conta | E-mail | Senha | Plano |
|-------|--------|-------|-------|
| Free | `demo.free@estante.plus` | `DemoEstante!24` | FREE |
| Plus | `demo.plus@estante.plus` | `DemoEstante!24` | PLUS |

---

## 6. Desenvolvimento local

1. **Banco local** — suba o Postgres com Docker:
   ```bash
   docker compose up -d
   ```
2. **Configure o backend** — copie e ajuste o `.env`:
   ```bash
   cd backend
   cp .env.example .env
   # DATABASE_URL já aponta para localhost:5432 no .env.example
   ```
3. **Migrations e seed**:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
4. **Rode os serviços** (dois terminais):
   ```bash
   # Terminal 1 — backend
   cd backend && npm run dev

   # Terminal 2 — frontend
   cd frontend && npm run dev
   ```
   Acesse `http://localhost:5173`. O Vite faz proxy de `/api` → `localhost:3001` automaticamente.

---

## Variáveis de ambiente — referência completa

### Backend

| Variável | Onde definir | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Render (painel) | Connection string do Neon |
| `JWT_SECRET` | Render (auto) | Gerado pelo Blueprint; mín. 32 chars em produção |
| `FRONTEND_URL` | Render (painel) | URL exata da Vercel (CORS) |
| `NODE_ENV` | Render (blueprint) | `production` |
| `CORS_ALLOW_VERCEL_PREVIEWS` | Render (opcional) | `1` para liberar `*.vercel.app` |
| `PORT` | Render (auto) | Injetado pelo Render automaticamente |
| `TRUST_PROXY_HOPS` | Render (opcional) | Padrão `1` — correto para Render |

### Frontend

| Variável | Onde definir | Descrição |
|----------|-------------|-----------|
| `VITE_API_URL` | Vercel (painel) | URL da API no Render, sem barra final |
