import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { focusRing } from "@/components/ui/FocusRing.tsx";

const STORAGE_KEY = "estante_plus_lgpd_storage_notice_v1";

/**
 * Aviso de armazenamento local (sessão) — alinhado ao espírito de transparência da LGPD,
 * sem cookies de terceiros neste projeto de demonstração.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore quota / private mode */
    }
    setVisible(false);
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] border-t border-stone-200/90 bg-[var(--color-paper)]/95 px-4 py-4 shadow-[0_-4px_24px_rgb(28_25_23/0.08)] backdrop-blur-md sm:px-5"
      role="region"
      aria-label="Aviso sobre dados no navegador"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-stone-700">
          <strong className="text-stone-900">Transparência (LGPD — demo):</strong> este site não usa cookies de
          rastreamento. Se você entrar na conta, guardamos apenas um token de sessão no{" "}
          <strong className="font-medium text-stone-800">armazenamento local</strong> do navegador para manter o login.
          Detalhes em{" "}
          <Link to="/privacidade" className={`${focusRing} font-semibold text-amber-900 underline underline-offset-2`}>
            Privacidade e LGPD
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className={`${focusRing} shrink-0 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-amber-50 transition hover:bg-stone-800`}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
