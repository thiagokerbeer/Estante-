import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { type VerifyOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { JWT_SECRET } from "../lib/security.js";

/** Evita corpo gigante / abuse em Authorization (JWT real costuma ter centenas de bytes). */
const MAX_JWT_CHARS = 2048;

const JWT_VERIFY: VerifyOptions = { algorithms: ["HS256"] };

export type AuthPayload = { userId: string };

export function signToken(userId: string): string {
  return jwt.sign({ userId } as AuthPayload, JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
}

function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, JWT_VERIFY);
    if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) return null;
    const uid = (decoded as { userId: unknown }).userId;
    if (typeof uid !== "string" || !uid || uid.length > 36) return null;
    return { userId: uid };
  } catch {
    return null;
  }
}

/** Autenticação opcional: token ausente, vazio ou grande demais → ignora (sem erro). */
function readBearerOptional(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token || token.length > MAX_JWT_CHARS) return null;
  return token;
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = readBearerOptional(req.headers.authorization);
  if (!token) {
    req.userId = undefined;
    next();
    return;
  }
  const p = verifyToken(token);
  req.userId = p?.userId;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "Token ausente" });
    return;
  }
  if (token.length > MAX_JWT_CHARS) {
    res.status(401).json({ error: "Token inválido ou expirado" });
    return;
  }
  const p = verifyToken(token);
  if (!p?.userId) {
    res.status(401).json({ error: "Token inválido ou expirado" });
    return;
  }
  req.userId = p.userId;
  next();
}

/**
 * Após JWT válido: confirma que o usuário ainda existe (evita sessão "zumbi" após exclusão da conta).
 * Express 4 não captura erros de async middleware automaticamente — try/catch encaminha para o handler de erro.
 */
export const requireSessionUser: RequestHandler = async (req, res, next) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  try {
    const row = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!row) {
      res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
};

export async function loadUserPlan(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planEndsAt: true },
  });
  if (!user) return { activePlus: false as const };
  if (user.plan !== "PLUS") return { activePlus: false as const };
  if (user.planEndsAt && user.planEndsAt < new Date()) {
    await prisma.user.update({
      where: { id: userId },
      data: { plan: "FREE", planEndsAt: null },
    });
    return { activePlus: false as const };
  }
  return { activePlus: true as const };
}
