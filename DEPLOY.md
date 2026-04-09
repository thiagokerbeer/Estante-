# Deploy: Render (API) + Vercel (front)

## Precisa de Neon?

**Não é obrigatório.** O `render.yaml` já provisiona um **PostgreSQL gratuito no Render**. Neon (ou Supabase) é só uma alternativa se quiser o banco fora do Render.

SQLite em disco no serviço web **não é adequado**: no plano gratuito o filesystem costuma ser **efêmero** — o arquivo some a cada deploy. Por isso o projeto usa **PostgreSQL** (o mesmo das migrations em `backend/prisma/migrations`).

## Backend (Render)

1. Conecte o repositório e use **Blueprint** (`render.yaml`) ou crie manualmente:
   - **Web service**: `rootDir` = `backend`
   - **Build**: `npm ci && npm run build && npx prisma migrate deploy && npx tsx prisma/seed.ts`
   - **Start**: `npm run start`
   - **Health check**: `/health`
2. Variáveis de ambiente:
   - `DATABASE_URL`: injetada automaticamente se você usar o Postgres do blueprint.
   - `JWT_SECRET`: o blueprint usa `generateValue: true` (valor forte gerado). Também pode definir manualmente (**mínimo 32 caracteres** em produção).
   - `FRONTEND_URL`: URL **exata** do site na Vercel, ex. `https://meu-app.vercel.app` (várias origens: separadas por vírgula).
   - Opcional: `CORS_ALLOW_VERCEL_PREVIEWS=1` para liberar previews `*.vercel.app` sem listar cada URL.
3. Anote a URL pública da API (ex. `https://estante-plus-api.onrender.com`).

## Frontend (Vercel)

1. Projeto na pasta **`frontend`** (root directory na Vercel = `frontend`).
2. Em **Environment Variables** (Production):
   - `VITE_API_URL` = URL da API no Render **sem barra no final**.
3. Deploy. O build embute `VITE_API_URL` no bundle; ao mudar a URL, faça **redeploy**.

## Desenvolvimento local

1. `docker compose up -d` na raiz (Postgres).
2. `backend/.env` com `DATABASE_URL` igual ao `.env.example` (Postgres local).
3. `cd backend && npx prisma migrate deploy && npm run db:seed`
4. API: `npm run dev` · Front: `npm run dev` (proxy `/api` → `localhost:3001`).
