import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { fieldInput, fieldInputError, fieldLabel } from "@/components/ui/fieldStyles.ts";
import { btnAccent } from "@/components/ui/buttons.ts";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";
import { demoAccounts } from "@/config/demoAccounts.ts";

type DemoKey = keyof typeof demoAccounts;
type DemoAccount = (typeof demoAccounts)[DemoKey];

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [demoLoading, setDemoLoading] = useState<DemoKey | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    try {
      await login(email, password);
      nav("/catalogo");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no login");
    } finally {
      setPending(false);
    }
  }

  function fillDemo(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);
    setErr(null);
  }

  async function enterAsDemo(key: DemoKey) {
    const account = demoAccounts[key];
    setErr(null);
    setDemoLoading(key);
    try {
      await login(account.email, account.password);
      nav("/catalogo");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no login");
      setEmail(account.email);
      setPassword(account.password);
    } finally {
      setDemoLoading(null);
    }
  }

  const busy = pending || demoLoading !== null;

  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div
        className="pointer-events-none absolute -left-24 -top-32 h-72 w-72 rounded-full bg-amber-200/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/3 h-64 w-64 rounded-full bg-stone-300/20 blur-3xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-[0_25px_50px_-12px_rgb(28_25_23/0.12),0_0_0_1px_rgb(28_25_23/0.04)]">
        <div
          className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-stone-700"
          role="presentation"
          aria-hidden
        />

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,24rem)]">
          {/* Formulário */}
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:pr-8 lg:pl-10 xl:px-14">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                to="/"
                className={`${focusRing} group inline-flex items-baseline gap-2 rounded-lg py-1`}
              >
                <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-stone-900 transition group-hover:text-amber-900">
                  Estante
                </span>
                <span className="rounded-md bg-gradient-to-br from-amber-600 to-amber-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Plus
                </span>
              </Link>
              <Link
                to="/"
                className={`${focusRing} text-sm font-medium text-stone-500 transition hover:text-stone-800`}
              >
                ← Voltar ao início
              </Link>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-900/80">Entrar</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight text-stone-900 sm:text-4xl">
              Bem-vindo de volta
            </h1>
            <p className="mt-3 max-w-md text-base leading-relaxed text-stone-600">
              Acesse seu acervo. Novo por aqui?{" "}
              <Link
                to="/cadastro"
                className={`${focusRing} font-semibold text-amber-900 underline decoration-amber-400/60 underline-offset-2 transition hover:decoration-amber-600`}
              >
                Criar conta grátis
              </Link>
            </p>

            <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
              <div>
                <label htmlFor="login-email" className={fieldLabel}>
                  E-mail
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${fieldInput} pl-11 ${err ? fieldInputError : ""}`}
                    placeholder="voce@email.com"
                    required
                    aria-invalid={!!err}
                    aria-describedby={err ? "login-error" : undefined}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className={fieldLabel}>
                  Senha
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
                    <LockIcon className="h-5 w-5" />
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${fieldInput} pl-11 ${err ? fieldInputError : ""}`}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    aria-invalid={!!err}
                    aria-describedby={err ? "login-error" : undefined}
                  />
                </div>
              </div>

              <div aria-live="polite">
                {err && (
                  <div
                    id="login-error"
                    role="alert"
                    className="rounded-xl border border-red-200/90 bg-red-50/90 px-4 py-3 text-sm font-medium text-red-900"
                  >
                    {err}
                  </div>
                )}
              </div>

              <button type="submit" disabled={busy} className={`${btnAccent} relative w-full py-3.5 text-base shadow-lg`}>
                {pending && <Spinner className="h-5 w-5 text-white" />}
                {pending ? "Entrando…" : "Entrar no Estante+"}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-stone-500 lg:text-left">
              Ao entrar, você concorda com o uso de sessão local descrito na{" "}
              <Link to="/privacidade" className={`${focusRing} font-medium text-amber-900 underline underline-offset-2`}>
                página de privacidade
              </Link>
              .
            </p>
          </div>

          {/* Demo — painel lateral */}
          <aside
            className="border-t border-stone-200/80 bg-gradient-to-b from-stone-50/95 to-amber-50/30 px-6 py-10 sm:px-8 lg:border-l lg:border-t-0 lg:py-12"
            aria-labelledby="demo-login-heading"
          >
            <h2 id="demo-login-heading" className="font-[family-name:var(--font-display)] text-xl text-stone-900">
              Experimente sem cadastrar
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Contas de demonstração — mesma senha nas duas. Ideal para comparar{" "}
              <span className="font-medium text-stone-800">FREE</span> e{" "}
              <span className="font-medium text-amber-900">PLUS</span>.
            </p>

            <ul className="mt-8 space-y-4">
              {(
                [
                  { key: "free" as const, variant: "neutral" as const },
                  { key: "plus" as const, variant: "premium" as const },
                ] as const
              ).map(({ key, variant }) => {
                const d = demoAccounts[key];
                const isPlus = variant === "premium";
                return (
                  <li key={key}>
                    <div
                      className={`rounded-2xl border p-4 shadow-sm transition ${
                        isPlus
                          ? "border-amber-300/70 bg-white/90 ring-1 ring-amber-900/5"
                          : "border-stone-200/90 bg-white/80 ring-1 ring-stone-900/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={`text-[10px] font-bold uppercase tracking-wider ${isPlus ? "text-amber-800" : "text-stone-500"}`}
                          >
                            {d.short}
                          </p>
                          <h3 className="mt-0.5 font-semibold text-stone-900">{d.title}</h3>
                        </div>
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            isPlus
                              ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm"
                              : "bg-stone-200 text-stone-700"
                          }`}
                        >
                          {d.kind}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-stone-600">{d.description}</p>

                      <div
                        className={`mt-3 space-y-1.5 rounded-xl px-3 py-2.5 font-mono text-[11px] leading-snug ${
                          isPlus ? "border border-amber-200/60 bg-amber-50/50 text-stone-800" : "bg-stone-100/90 text-stone-800"
                        }`}
                      >
                        <p className="break-all">
                          <span className={isPlus ? "text-amber-800/90" : "text-stone-500"}>e-mail · </span>
                          {d.email}
                        </p>
                        <p>
                          <span className={isPlus ? "text-amber-800/90" : "text-stone-500"}>senha · </span>
                          {d.password}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          className={`${focusRing} min-h-10 rounded-xl border px-3 text-sm font-semibold transition disabled:opacity-50 ${
                            isPlus
                              ? "border-amber-300/80 bg-white text-amber-950 hover:bg-amber-50"
                              : "border-stone-300 bg-white text-stone-800 hover:bg-stone-50"
                          }`}
                          onClick={() => fillDemo(d)}
                          disabled={busy}
                        >
                          Preencher
                        </button>
                        <button
                          type="button"
                          className={`${focusRing} relative flex min-h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 ${
                            isPlus
                              ? "bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700"
                              : "bg-stone-800 hover:bg-stone-900"
                          }`}
                          onClick={() => void enterAsDemo(key)}
                          disabled={busy}
                        >
                          {demoLoading === key && <Spinner className="h-4 w-4 text-white" />}
                          {demoLoading === key ? "Entrando…" : "Entrar agora"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 rounded-xl border border-dashed border-stone-300/80 bg-white/50 px-3 py-2.5 text-center text-[11px] leading-relaxed text-stone-500">
              Se o login falhar, rode{" "}
              <code className="rounded bg-stone-200/70 px-1 py-0.5 font-mono text-stone-700">npm run db:seed</code> na
              pasta <span className="font-medium text-stone-700">backend</span>.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
