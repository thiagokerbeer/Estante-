declare global {
  namespace Express {
    interface Request {
      /** ID do usuário extraído e validado do JWT. Populado por `requireAuth` ou `optionalAuth`. */
      userId?: string;
      /**
       * Dados completos do usuário da sessão, populados por `requireSessionUser`.
       * Evita uma segunda query ao banco nas rotas que precisam de todos os campos.
       */
      sessionUser?: {
        id: string;
        email: string;
        plan: string;
        planEndsAt: Date | null;
        createdAt: Date;
        privacyNoticeAcceptedAt: Date | null;
      };
    }
  }
}
export {};
