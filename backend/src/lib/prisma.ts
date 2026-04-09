import { PrismaClient } from "@prisma/client";

/**
 * Instância única do Prisma Client.
 * Em desenvolvimento, loga queries e warnings para facilitar debug.
 * Em produção, apenas warnings e erros para não vazar dados sensíveis nos logs.
 */
export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? [
          { emit: "stdout", level: "query" },
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ]
      : [
          { emit: "stdout", level: "warn" },
          { emit: "stdout", level: "error" },
        ],
});
