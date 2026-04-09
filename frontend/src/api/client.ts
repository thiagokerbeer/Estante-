function resolveApiBase(): string {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "/api";
  if (import.meta.env.PROD) {
    console.warn(
      "[Estante+] VITE_API_URL não definido no build. Configure na Vercel apontando para a API no Render."
    );
  }
  return "";
}

const base = resolveApiBase();

function parseJsonSafe<T>(text: string, context: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      context === "error"
        ? "Resposta inválida do servidor. Tente de novo em instantes."
        : "Resposta inválida do servidor."
    );
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers: h, ...rest } = options;
  const headers = new Headers(h);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const url = `${base || ""}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...rest,
    headers,
  });
  const text = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  const looksJson = ct.includes("application/json") || /^\s*[\[{]/.test(text);

  if (!res.ok) {
    if (text && looksJson) {
      const data = parseJsonSafe<unknown>(text, "error");
      const err = data as { error?: string };
      throw new Error(err?.error ?? res.statusText);
    }
    throw new Error(res.statusText || "Falha na requisição");
  }
  if (!text) return undefined as T;
  if (!looksJson) {
    throw new Error("Resposta inválida do servidor.");
  }
  return parseJsonSafe<T>(text, "body");
}
