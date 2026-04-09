/**
 * Credenciais de demonstração — espelham o seed do backend (`prisma/seed.ts`).
 * Não use em produção.
 */
export const DEMO_PASSWORD = "DemoEstante!24" as const;

export const demoAccounts = {
  free: {
    kind: "FREE" as const,
    email: "demo.free@estante.plus",
    password: DEMO_PASSWORD,
    title: "Conta grátis",
    short: "Plano gratuito",
    description: "Acesso aos títulos abertos. Livros Estante+ aparecem bloqueados até assinar.",

  },
  plus: {
    kind: "PLUS" as const,
    email: "demo.plus@estante.plus",
    password: DEMO_PASSWORD,
    title: "Conta premium",
    short: "Estante+",
    description: "Catálogo completo: sinopses e títulos premium liberados (como assinante ativo).",

  },
} as const;
