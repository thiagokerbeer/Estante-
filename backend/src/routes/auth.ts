import { Router } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { signToken, requireAuth, requireSessionUser } from "../middleware/auth.js";
import {
  normalizeEmail,
  validateEmailShape,
  validatePasswordForAuth,
  validatePasswordInputLength,
} from "../lib/validation.js";

export const authRouter = Router();

/** Hash bcrypt de string impossível de adivinhar — comparação quando o e-mail não existe (reduz vazamento por tempo). */
const BCRYPT_DUMMY_HASH =
  "$2a$10$bTzXG.0rd3fk4YtG1ivjvOvIsX2gmX0mLadaNe9C3zN99L5dmQJAu";

function userPublicFields(user: {
  id: string;
  email: string;
  plan: string;
  planEndsAt: Date | null;
  createdAt: Date;
  privacyNoticeAcceptedAt: Date | null;
}) {
  return {
    id: user.id,
    email: user.email,
    plan: user.plan,
    planEndsAt: user.planEndsAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    privacyNoticeAcceptedAt: user.privacyNoticeAcceptedAt?.toISOString() ?? null,
  };
}

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");
    const acceptPrivacyNotice = req.body?.acceptPrivacyNotice === true;
    const pwdLen = validatePasswordInputLength(password);
    if (!pwdLen.ok) {
      res.status(400).json({ error: pwdLen.error });
      return;
    }
    if (!validateEmailShape(email)) {
      res.status(400).json({ error: "Informe um e-mail válido" });
      return;
    }
    const pwdPolicy = validatePasswordForAuth(password);
    if (!pwdPolicy.ok) {
      res.status(400).json({ error: pwdPolicy.error });
      return;
    }
    if (!acceptPrivacyNotice) {
      res.status(400).json({
        error: "É necessário aceitar o aviso de privacidade para criar a conta (veja GET /legal/privacy-notice).",
      });
      return;
    }
    const acceptedAt = new Date();
    const hash = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: { email, password: hash, privacyNoticeAcceptedAt: acceptedAt },
        select: {
          id: true,
          email: true,
          plan: true,
          planEndsAt: true,
          createdAt: true,
          privacyNoticeAcceptedAt: true,
        },
      });
      const token = signToken(user.id);
      res.status(201).json({
        token,
        user: userPublicFields(user),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        res.status(400).json({
          error:
            "Não foi possível concluir o cadastro. Se você já tem conta, use Entrar; caso contrário, tente outro e-mail.",
        });
        return;
      }
      throw e;
    }
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password ?? "");
    const pwdLen = validatePasswordInputLength(password);
    if (!pwdLen.ok) {
      res.status(400).json({ error: pwdLen.error });
      return;
    }
    if (!validateEmailShape(email)) {
      res.status(401).json({ error: "E-mail ou senha incorretos" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    const hash = user?.password ?? BCRYPT_DUMMY_HASH;
    const passwordOk = await bcrypt.compare(password, hash);
    if (!user || !passwordOk) {
      res.status(401).json({ error: "E-mail ou senha incorretos" });
      return;
    }
    const token = signToken(user.id);
    res.json({
      token,
      user: userPublicFields(user),
    });
  })
);

authRouter.get(
  "/me",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    res.json(userPublicFields(req.sessionUser!));
  })
);

authRouter.get(
  "/data-export",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    res.json({
      exportedAt: new Date().toISOString(),
      privacyNoticeUrl: "/legal/privacy-notice",
      user: userPublicFields(req.sessionUser!),
    });
  })
);

authRouter.delete(
  "/me",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const { count } = await prisma.user.deleteMany({ where: { id: userId } });
    if (count === 0) {
      res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
      return;
    }
    res.status(204).send();
  })
);
