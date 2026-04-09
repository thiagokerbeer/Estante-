const DEFAULT_DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

function parseOrigins(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function hostnameEndsWithVercel(host: string): boolean {
  return host === "vercel.app" || host.endsWith(".vercel.app");
}

/**
 * FRONTEND_URL: URLs do front (Vercel), separadas por vírgula.
 * CORS_ALLOW_VERCEL_PREVIEWS=1: permite qualquer host *.vercel.app (útil para previews).
 */
export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;

  const allowVercel =
    process.env.CORS_ALLOW_VERCEL_PREVIEWS === "1" ||
    process.env.CORS_ALLOW_VERCEL_PREVIEWS === "true";
  if (allowVercel) {
    try {
      if (hostnameEndsWithVercel(new URL(origin).hostname)) return true;
    } catch {
      /* ignore */
    }
  }

  const inProd = process.env.NODE_ENV === "production";
  const explicit = parseOrigins(process.env.FRONTEND_URL);
  const allowed = [...(inProd ? [] : DEFAULT_DEV_ORIGINS), ...explicit];
  return allowed.includes(origin);
}
