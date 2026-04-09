import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authRouter } from "./routes/auth.js";
import { booksRouter } from "./routes/books.js";
import { subscriptionRouter } from "./routes/subscription.js";
import { legalRouter } from "./routes/legal.js";
import { isOriginAllowed } from "./lib/cors.js";
import { assertProductionSecurity, isProd, warnProductionCors } from "./lib/security.js";
import { prisma } from "./lib/prisma.js";

assertProductionSecurity();
warnProductionCors();

const app = express();
const port = Number(process.env.PORT) || 3001;
const startedAt = Date.now();

app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 1) || 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
    frameguard: { action: "deny" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, origin ?? true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));

/** Log de cada requisição: método, rota, status HTTP e duração em ms. */
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";
    const icon = level === "error" ? "✗" : level === "warn" ? "!" : "✓";
    console.log(`[req] ${icon} ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas tentativas. Tente novamente em alguns minutos." },
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Muitas requisições. Aguarde e tente de novo." },
});

const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Limite de alterações de plano atingido. Tente mais tarde." },
});

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    name: "estante-plus-api",
    version: process.env.npm_package_version ?? "1.0.0",
    env: process.env.NODE_ENV ?? "development",
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  });
});

app.use("/legal", readLimiter, legalRouter);
app.use("/auth", authLimiter, authRouter);
app.use("/books", readLimiter, booksRouter);
app.use("/subscription", subscriptionLimiter, subscriptionRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Recurso não encontrado." });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (res.headersSent) return;
  console.error("[api]", err);
  const message =
    isProd() || !(err instanceof Error)
      ? "Erro interno do servidor."
      : err.message || "Erro interno do servidor.";
  res.status(500).json({ error: message });
});

const server = app.listen(port, "0.0.0.0", () => {
  console.log(`[api] Estante+ na porta ${port} (${process.env.NODE_ENV ?? "development"})`);
});

/**
 * Graceful shutdown: aguarda conexões em andamento fechar antes de sair.
 * Essencial no Render e Docker (SIGTERM precede o SIGKILL por ~30s).
 */
async function shutdown(signal: string): Promise<void> {
  console.log(`[api] ${signal} recebido — encerrando...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("[api] Banco desconectado. Processo encerrado.");
    } catch (err) {
      console.error("[api] Erro ao desconectar banco:", err);
    } finally {
      process.exit(0);
    }
  });
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
