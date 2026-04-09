/** RFC 5321/5322 prático — evita payloads enormes e e-mails absurdamente longos. */
export const EMAIL_MAX_LENGTH = 254;

/** bcrypt trunca em 72 bytes; limitar entrada evita trabalho desnecessário e abuso. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

/** Rejeita senhas gigantes antes de bcrypt (custo de CPU). */
export const PASSWORD_INPUT_MAX_LENGTH = 256;

/**
 * IDs do Prisma (`cuid()` e variantes): alfanuméricos, tamanho estável — bloqueia lixo e caracteres especiais na URL.
 */
export function isValidBookId(id: string): boolean {
  return id.length >= 20 && id.length <= 36 && /^[a-z0-9]+$/i.test(id);
}

export function normalizeEmail(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .slice(0, EMAIL_MAX_LENGTH);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmailShape(email: string): boolean {
  if (!email || email.length > EMAIL_MAX_LENGTH) return false;
  return EMAIL_RE.test(email);
}

export function validatePasswordForAuth(password: string): { ok: true } | { ok: false; error: string } {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, error: `Senha com no mínimo ${PASSWORD_MIN_LENGTH} caracteres é obrigatória` };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, error: `Senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres` };
  }
  return { ok: true };
}

export function validatePasswordInputLength(password: string): { ok: true } | { ok: false; error: string } {
  if (password.length > PASSWORD_INPUT_MAX_LENGTH) {
    return { ok: false, error: "Entrada inválida." };
  }
  return { ok: true };
}
