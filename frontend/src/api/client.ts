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
  if (!res.ok) {
    const data = text ? (JSON.parse(text) as unknown) : null;
    const err = data as { error?: string } | null;
    throw new Error(err?.error ?? res.statusText);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}
