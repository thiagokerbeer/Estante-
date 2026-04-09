const DEV_FALLBACK_SECRET = "dev-secret";

export const JWT_SECRET = process.env.JWT_SECRET ?? DEV_FALLBACK_SECRET;

/** Em produção, JWT fraco ou ausente encerra o processo (evita tokens forjáveis). */
export function assertProductionSecurity(): void {
  if (process.env.NODE_ENV !== "production") {
    if (JWT_SECRET === DEV_FALLBACK_SECRET) {
      console.warn(
        "[segurança] JWT_SECRET não definido — usando segredo de desenvolvimento (não use em produção)."
      );
    }
    return;
  }

  if (!process.env.JWT_SECRET || JWT_SECRET === DEV_FALLBACK_SECRET) {
    console.error(
      "[segurança] Em produção é obrigatório definir JWT_SECRET forte (variável de ambiente). Encerrando."
    );
    process.exit(1);
  }

  if (JWT_SECRET.length < 32) {
    console.error(
      "[segurança] JWT_SECRET muito curto em produção (mínimo sugerido: 32 caracteres). Encerrando."
    );
    process.exit(1);
  }
}

export function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}
