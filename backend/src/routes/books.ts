import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { optionalAuth, loadUserPlan } from "../middleware/auth.js";

export const booksRouter = Router();

function bookCard(b: {
  id: string;
  title: string;
  author: string;
  isPremium: boolean;
  locked: boolean;
}) {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    isPremium: b.isPremium,
    locked: b.locked,
  };
}

booksRouter.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    let activePlus = false;
    if (userId) {
      const p = await loadUserPlan(userId);
      activePlus = p.activePlus;
    }
    const list = await prisma.book.findMany({ orderBy: { title: "asc" } });
    res.json(
      list.map((b) =>
        bookCard({
          id: b.id,
          title: b.title,
          author: b.author,
          isPremium: b.isPremium,
          locked: b.isPremium && !activePlus,
        })
      )
    );
  })
);

booksRouter.get(
  "/:id",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const userId = req.userId;
    let activePlus = false;
    if (userId) {
      const p = await loadUserPlan(userId);
      activePlus = p.activePlus;
    }
    const id = String(req.params.id);
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      res.status(404).json({ error: "Livro não encontrado" });
      return;
    }
    if (book.isPremium && !activePlus) {
      res.json({
        ...bookCard({
          id: book.id,
          title: book.title,
          author: book.author,
          isPremium: true,
          locked: true,
        }),
        synopsis: null as string | null,
      });
      return;
    }
    res.json({
      ...bookCard({
        id: book.id,
        title: book.title,
        author: book.author,
        isPremium: book.isPremium,
        locked: false,
      }),
      synopsis: book.synopsis,
    });
  })
);
