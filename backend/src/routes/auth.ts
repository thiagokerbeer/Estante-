import { Router } from "express";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { signToken, requireAuth, requireSessionUser } from "../middleware/auth.js";

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const acceptPrivacyNotice = req.body?.acceptPrivacyNotice === true;
    if (!email || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Informe um e-mail válido" });
      return;
    }
    if (!password || password.length < 6) {
      res.status(400).json({ error: "Senha com no mínimo 6 caracteres é obrigatória" });
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
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
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
    const userId = req.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        plan: true,
        planEndsAt: true,
        createdAt: true,
        privacyNoticeAcceptedAt: true,
      },
    });
    if (!user) {
      res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
      return;
    }
    res.json(userPublicFields(user));
  })
);

authRouter.get(
  "/data-export",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        plan: true,
        planEndsAt: true,
        createdAt: true,
        privacyNoticeAcceptedAt: true,
      },
    });
    if (!user) {
      res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
      return;
    }
    res.json({
      exportedAt: new Date().toISOString(),
      privacyNoticeUrl: "/legal/privacy-notice",
      user: userPublicFields(user),
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
