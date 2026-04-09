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

assertProductionSecurity();
warnProductionCors();

const app = express();
const port = Number(process.env.PORT) || 3001;

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
  res.json({ ok: true, name: "estante-plus-api" });
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Estante+ API na porta ${port}`);
});
