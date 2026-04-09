import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { requireAuth, requireSessionUser } from "../middleware/auth.js";

export const subscriptionRouter = Router();

/** Simula checkout: ativa PLUS por 30 dias (sem gateway de pagamento). */
subscriptionRouter.post(
  "/subscribe",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    const ends = new Date();
    ends.setDate(ends.getDate() + 30);
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { plan: "PLUS", planEndsAt: ends },
        select: { id: true, email: true, plan: true, planEndsAt: true },
      });
      res.json({
        message: "Assinatura Estante+ ativada (demo — 30 dias)",
        user: { ...user, planEndsAt: user.planEndsAt!.toISOString() },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
        return;
      }
      throw e;
    }
  })
);

subscriptionRouter.post(
  "/cancel",
  requireAuth,
  requireSessionUser,
  asyncHandler(async (req, res) => {
    const userId = req.userId!;
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { plan: "FREE", planEndsAt: null },
        select: { id: true, email: true, plan: true, planEndsAt: true },
      });
      res.json({
        message: "Plano voltou para gratuito",
        user: { ...user, planEndsAt: null },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        res.status(401).json({ error: "Sessão inválida. Faça login novamente." });
        return;
      }
      throw e;
    }
  })
);
