# Estante+

Aplicação web de **catálogo de livros** com **planos Free e Plus** (demonstração), autenticação por **JWT**, API REST em **Node** e interface em **React**. Projeto pensado para **portfólio**: mostra separação front/back, PostgreSQL em produção, segurança básica (CORS, rate limit, Helmet) e fluxo de “assinatura” simulado com livros premium bloqueados para quem não está no Plus.

**Repositório:** [github.com/thiagokerbeer/Estante-](https://github.com/thiagokerbeer/Estante-)

---

## O que o projeto demonstra

- **Monorepo** com `frontend` (SPA) e `backend` (API), sem framework full-stack único — deploy independente (ex.: Vercel + Render).
- **Autenticação real** (cadastro/login, hash de senha, sessão via Bearer token).
- **Autorização por plano**: catálogo e fichas de livro adaptam o que o usuário pode ver (livros premium “trancados” sem Plus ativo).
- **Persistência** com **Prisma** e **PostgreSQL** (migrations versionadas; alinhado com ambiente de produção).
- **Experiência de produto**: home, catálogo, página do livro, preços/assinatura (rota privada), privacidade (LGPD em modo demonstração), banner de cookies.
- **Operação**: health check (`/health`), variáveis de ambiente documentadas, `docker-compose` só para Postgres local, blueprint `render.yaml` para API + banco.

---

## Stack

| Camada | Tecnologias |
|--------|----------------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js 20+, Express 4, TypeScript, Prisma 6 |
| **Dados** | PostgreSQL 16 |
| **Auth** | bcryptjs, jsonwebtoken |
| **Segurança / HTTP** | helmet, cors configurável, express-rate-limit |

---

## Arquitetura (visão geral)

```text
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Vercel    │  ───────────►  │  Render (Node)   │
│  (frontend) │   VITE_API_URL │  estante-plus-api │
└─────────────┘                └────────┬─────────┘
                                        │
                                        │ DATABASE_URL
                                        ▼
                                ┌───────────────┐
                                │  PostgreSQL   │
                                └───────────────┘
```

Em **desenvolvimento**, o Vite faz **proxy** de `/api` → `http://localhost:3001`, então o front chama caminhos como `/api/books` sem CORS extra na máquina local.

---

## Estrutura do repositório

```text
.
├── frontend/          # SPA React (build estático)
├── backend/           # API Express + Prisma
├── docker-compose.yml # Postgres local
├── render.yaml        # Blueprint Render (API + Postgres)
├── DEPLOY.md          # Passo a passo detalhado de deploy
└── README.md          # Este arquivo
```

Principais entradas:

- **API:** `backend/src/index.ts` — rotas `/auth`, `/books`, `/subscription`, `/legal`, `/health`.
- **Validação / limites de entrada:** `backend/src/lib/validation.ts` — e-mail, senha e `id` de livro antes de ir ao banco.
- **Modelos:** `backend/prisma/schema.prisma` — `User` (plano `FREE` | `PLUS`), `Book` (`isPremium`).
- **Seed:** `backend/prisma/seed.ts` — dados iniciais para demo.
- **Front:** `frontend/src/App.tsx` — rotas; `frontend/src/api/client.ts` — cliente HTTP (`VITE_API_URL` ou `/api` em dev).

---

## Pré-requisitos

- **Node.js 20+** ([nodejs.org](https://nodejs.org/))
- **Docker** (opcional mas recomendado) para subir PostgreSQL local com um comando
- Conta **Git** e, para deploy, contas em **Render** e **Vercel** (ou equivalentes)

---

## Como rodar localmente

### 1. Banco PostgreSQL

Na **raiz** do repositório:

```bash
docker compose up -d
```

Isso sobe Postgres 16 com usuário/db `estante` (ver `docker-compose.yml`).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Ajuste .env se necessário — o exemplo já aponta para localhost:5432/estante
npm ci
npx prisma migrate deploy
npm run db:seed
npm run dev
```

A API escuta na porta **3001** por padrão (`PORT` no `.env`).

### 3. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env.local
# Em dev, pode deixar VITE_API_URL vazio — o cliente usa /api (proxy do Vite)
npm ci
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente `http://localhost:5173`).

### Scripts úteis

| Pasta | Comando | Descrição |
|--------|---------|-----------|
| `backend` | `npm run dev` | API com reload (`tsx watch`) |
| `backend` | `npm run build` | Gera Prisma Client + `tsc` → `dist/` |
| `backend` | `npm run start` | Produção: `node dist/index.js` |
| `backend` | `npm run db:seed` | Repopula dados de demonstração |
| `frontend` | `npm run dev` | Servidor Vite |
| `frontend` | `npm run build` | Typecheck + bundle para produção |
| `frontend` | `npm run covers` | Gera assets de capa (script auxiliar) |

---

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Prisma) |
| `JWT_SECRET` | Segredo para assinar JWT; em produção use valor longo e aleatório (mín. 32 caracteres) |
| `FRONTEND_URL` | Origem(s) permitida(s) no CORS (URL exata da Vercel; várias separadas por vírgula) |
| `PORT` | Porta da API (padrão `3001`) |
| `CORS_ALLOW_VERCEL_PREVIEWS` | Opcional: `1` para liberar previews `*.vercel.app` |
| `TRUST_PROXY_HOPS` | Opcional: atrás de proxy (ex. Render) |

Arquivo de referência: `backend/.env.example`.

### Frontend (build / Vercel)

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL pública da API **sem** barra no final (obrigatória no build de produção) |

Em desenvolvimento, se `VITE_API_URL` estiver vazio, o cliente usa **`/api`** (proxy). Ver `frontend/.env.example`.

**Nunca commite** arquivos `.env` com segredos reais — eles já estão no `.gitignore`.

---

## API (resumo)

Todas as respostas relevantes são JSON. Prefixo em produção é a origem da API (sem `/api` no servidor; o `/api` é só convenção no dev via Vite).

| Área | Exemplos | Notas |
|------|----------|--------|
| Saúde | `GET /health` | Monitoramento / Render health check |
| Auth | registro, login (ver rotas em `backend/src/routes/auth.ts`) | JWT no header `Authorization: Bearer …` |
| Livros | `GET /books`, `GET /books/:id` | Auth opcional; premium pode vir “trancado” conforme plano |
| Assinatura | rotas em `/subscription` | Fluxo de demonstração |
| Legal | `/legal` | Textos / LGPD demo |

Limites de taxa (rate limit) estão aplicados por grupo de rotas no `index.ts` da API.

---

## Deploy em produção

O passo a passo completo (Render + Vercel, Postgres gerenciado, CORS, variáveis) está em **[DEPLOY.md](./DEPLOY.md)**. O arquivo **[render.yaml](./render.yaml)** descreve um blueprint com **PostgreSQL gratuito** e o serviço web apontando para a pasta `backend`.

Resumo:

1. Subir a **API** no Render (build com migrate + seed, start `npm run start`).
2. Definir **`FRONTEND_URL`** com a URL exata do front na Vercel.
3. Publicar o **frontend** na Vercel com **root directory** `frontend` e `VITE_API_URL` = URL da API.

---

## Segurança e escopo de demonstração

- Senhas com **hash bcrypt**; política **mínimo 8 / máximo 72 caracteres** (limite do bcrypt) e teto de entrada para evitar abuso de CPU no login.
- **Login**: comparação bcrypt também quando o e-mail não existe (hash dummy fixo), reduzindo **vazamento por tempo** entre “usuário inexistente” e “senha errada”.
- **JWT**: apenas **HS256**; limite de tamanho no header `Authorization`; `userId` no payload validado (comprimento) antes de usar.
- **`GET /books/:id`**: validação do parâmetro `id` (formato esperado de IDs do Prisma) antes de consultar o banco.
- **Helmet** com `frameguard` e `referrerPolicy`, **CORS** restrito por origem, **rate limiting** em auth, leituras e assinatura; aviso em log na subida se **produção** estiver sem `FRONTEND_URL` e sem previews da Vercel (evita deploy quebrado “mudo” no browser).
- **Frontend**: cliente HTTP trata respostas **não JSON** (erro de proxy/HTML) sem estourar `JSON.parse` na cara do usuário.
- Token em **localStorage** (padrão SPA); mitigue **XSS** mantendo dependências atualizadas e evitando `dangerouslySetInnerHTML` / injeção de HTML — o projeto não usa esses padrões no código atual.
- O fluxo de **pagamento / assinatura real** não está integrado a gateway — é adequado para **portfólio** e aprendizado.
- Campos como aceite de privacidade no cadastro ilustram preocupação com **LGPD** em nível de UX/modelo; não substitui assessoria jurídica.

---

## Licença e uso

Código disponível para **estudo e portfólio**. Se reutilizar trechos, mantenha créditos e adapte segredos/URLs aos seus próprios ambientes.

---

## Autor

**Thiago Kerbeer** — projeto **Estante+** para demonstração de habilidades em desenvolvimento web full-stack moderno.
