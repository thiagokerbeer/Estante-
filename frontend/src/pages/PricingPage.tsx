import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { Alert } from "@/components/ui/Alert.tsx";
import { btnAccent, btnGhost } from "@/components/ui/buttons.ts";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 text-stone-700">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"
        aria-hidden
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-6" />
        </svg>
      </span>
      <span className="text-sm leading-relaxed sm:text-base">{children}</span>
    </li>
  );
}

export function PricingPage() {
  const { token, user, refreshUser } = useAuth();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isPlus = user?.plan === "PLUS";

  async function subscribe() {
    if (!token) return;
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      const r = await api<{ message: string }>("/subscription/subscribe", {
        method: "POST",
        token,
      });
      setMsg(r.message);
      await refreshUser();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!token) return;
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      const r = await api<{ message: string }>("/subscription/cancel", {
        method: "POST",
        token,
      });
      setMsg(r.message);
      await refreshUser();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        eyebrow="Assinatura"
        title="Estante+"
        description="Ambiente de demonstração: ativação imediata, sem gateway de pagamento. Ideal para evoluir com Stripe ou PagSeguro depois."
      />

      <div className="mt-10 overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 via-white to-white shadow-[var(--shadow-card-hover)] ring-1 ring-stone-900/5">
        <div className="border-b border-amber-100/80 bg-gradient-to-r from-amber-100/40 to-transparent px-6 py-4 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-900/80">Plano mensal · demo</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-stone-900">
            R$ 19,90
            <span className="ml-1 text-lg font-sans font-normal text-stone-500">/mês</span>
          </p>
        </div>
        <div className="px-6 py-8 sm:px-8">
          <ul className="space-y-4">
            <CheckItem>Catálogo premium desbloqueado na hora</CheckItem>
            <CheckItem>Sinopses completas em todos os títulos</CheckItem>
            <CheckItem>Arquitetura pronta para cobrança real</CheckItem>
          </ul>

          {isPlus ? (
            <div className="mt-8 space-y-4">
              <Alert variant="success" title="Assinatura ativa">
                <p>
                  Você está com <strong>Estante+</strong>
                  {user?.planEndsAt && (
                    <>
                      {" "}
                      até <strong>{new Date(user.planEndsAt).toLocaleDateString("pt-BR")}</strong>
                    </>
                  )}
                  .
                </p>
              </Alert>
              <button
                type="button"
                onClick={() => void cancel()}
                disabled={busy}
                className={`${btnGhost} relative w-full gap-2`}
              >
                {busy && <Spinner className="h-5 w-5 text-stone-700" />}
                {busy ? "Processando…" : "Voltar ao plano gratuito (demo)"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void subscribe()}
              disabled={busy}
              className={`${btnAccent} relative mt-8 w-full gap-2 py-3.5 text-base shadow-lg`}
            >
              {busy && <Spinner className="h-5 w-5 text-white" />}
              {busy ? "Ativando…" : "Ativar Estante+ (simulado)"}
            </button>
          )}

          <div className="mt-6 space-y-3" aria-live="polite">
            {msg && <Alert variant="info">{msg}</Alert>}
            {err && (
              <Alert variant="error" title="Algo deu errado">
                {err}
              </Alert>
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center">
        <Link
          to="/catalogo"
          className={`${focusRing} inline-flex min-h-11 items-center justify-center rounded-lg text-sm font-semibold text-amber-800 hover:underline`}
        >
          ← Voltar ao catálogo
        </Link>
      </p>
    </div>
  );
}
