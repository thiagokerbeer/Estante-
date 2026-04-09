import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { AuthPanel } from "@/components/ui/AuthPanel.tsx";
import { fieldInput, fieldInputError, fieldLabel } from "@/components/ui/fieldStyles.ts";
import { btnAccent } from "@/components/ui/buttons.ts";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!acceptPrivacy) {
      setErr("É necessário aceitar o aviso de privacidade para criar a conta.");
      return;
    }
    setPending(true);
    try {
      await register(email, password, true);
      nav("/catalogo");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Não foi possível cadastrar");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthPanel>
      <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-stone-900 sm:text-3xl">
        Crie sua conta
      </h1>
      <p className="mt-2 text-sm text-stone-600 sm:text-base">
        Já tem conta?{" "}
        <Link to="/entrar" className={`${focusRing} font-semibold text-amber-800 underline-offset-2 hover:underline`}>
          Entrar
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <label htmlFor="reg-email" className={fieldLabel}>
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${fieldInput} ${err ? fieldInputError : ""}`}
            required
            aria-invalid={!!err}
            aria-describedby={err ? "reg-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="reg-password" className={fieldLabel}>
            Senha <span className="font-normal text-stone-500">(mín. 8 caracteres)</span>
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${fieldInput} ${err ? fieldInputError : ""}`}
            required
            minLength={8}
            aria-invalid={!!err}
            aria-describedby={err ? "reg-error" : undefined}
          />
        </div>
        <div className="flex gap-3 rounded-xl border border-stone-200/90 bg-stone-50/80 p-4">
          <input
            id="reg-privacy"
            type="checkbox"
            checked={acceptPrivacy}
            onChange={(e) => setAcceptPrivacy(e.target.checked)}
            className={`${focusRing} mt-0.5 h-4 w-4 shrink-0 rounded border-stone-400 text-amber-700`}
          />
          <label htmlFor="reg-privacy" className="text-sm leading-snug text-stone-700">
            Li e aceito o{" "}
            <Link
              to="/privacidade"
              className={`${focusRing} font-semibold text-amber-900 underline underline-offset-2`}
            >
              aviso de privacidade e as informações sobre LGPD
            </Link>{" "}
            deste projeto de demonstração (consentimento explícito — art. 8º da LGPD).
          </label>
        </div>
        <div aria-live="polite">
          {err && (
            <p id="reg-error" className="text-sm font-medium text-red-700" role="alert">
              {err}
            </p>
          )}
        </div>
        <button type="submit" disabled={pending} className={`${btnAccent} relative w-full gap-2`}>
          {pending && <Spinner className="h-5 w-5 text-white" />}
          {pending ? "Criando…" : "Criar conta grátis"}
        </button>
      </form>
    </AuthPanel>
  );
}
