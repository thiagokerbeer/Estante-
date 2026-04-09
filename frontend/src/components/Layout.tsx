import { useEffect, useId, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";
import { CookieBanner } from "@/components/CookieBanner.tsx";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  );
}

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${focusRing} flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
      isActive ? "bg-stone-900 text-amber-50" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${focusRing} flex min-h-12 items-center rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
      isActive ? "bg-stone-900 text-amber-50" : "text-stone-700 hover:bg-stone-100"
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo-principal"
        className={`${focusRing} fixed left-4 top-4 z-[100] -translate-y-16 rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-amber-50 opacity-0 transition focus:translate-y-0 focus:opacity-100`}
      >
        Ir para o conteúdo
      </a>

      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[var(--color-paper)]/90 shadow-[0_1px_0_rgb(28_25_23/0.04)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <Link
            to="/"
            className={`${focusRing} group flex shrink-0 items-baseline gap-2 rounded-lg py-1`}
          >
            <span className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-stone-900 transition group-hover:text-amber-900">
              Estante
            </span>
            <span className="rounded-md bg-gradient-to-br from-amber-600 to-amber-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Plus
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 md:flex"
            aria-label="Principal"
          >
            <NavLink to="/" end className={navLinkClass}>
              Início
            </NavLink>
            <NavLink to="/catalogo" className={navLinkClass}>
              Catálogo
            </NavLink>
            {user ? (
              <>
                <NavLink to="/assinatura" className={navLinkClass}>
                  {user.plan === "PLUS" ? "Assinatura" : "Assinar"}
                </NavLink>
                <span className="mx-1 hidden h-4 w-px bg-stone-300 lg:block" aria-hidden />
                <span
                  className="hidden max-w-[160px] truncate px-2 text-xs text-stone-500 lg:inline"
                  title={user.email}
                >
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className={`${focusRing} ml-1 min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-100/80`}
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/entrar" className={navLinkClass}>
                  Entrar
                </NavLink>
                <NavLink
                  to="/cadastro"
                  className={`${focusRing} ml-1 inline-flex min-h-11 items-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-amber-500 hover:to-amber-700`}
                >
                  Criar conta
                </NavLink>
              </>
            )}
          </nav>

          <button
            type="button"
            className={`${focusRing} flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100 md:hidden`}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-[2px] md:hidden"
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
            />
            <div
              id={menuId}
              className="relative z-50 border-t border-stone-200/80 bg-[var(--color-paper)] px-4 py-4 shadow-lg md:hidden"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>
                  Início
                </NavLink>
                <NavLink to="/catalogo" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>
                  Catálogo
                </NavLink>
                {user ? (
                  <>
                    <NavLink
                      to="/assinatura"
                      className={mobileNavLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      {user.plan === "PLUS" ? "Assinatura" : "Assinar Estante+"}
                    </NavLink>
                    <p className="truncate px-4 py-2 text-xs text-stone-500">{user.email}</p>
                    <button
                      type="button"
                      className={`${focusRing} flex min-h-12 items-center rounded-xl px-4 py-3 text-left text-base font-semibold text-amber-900 hover:bg-amber-50`}
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/entrar" className={mobileNavLinkClass} onClick={() => setMobileOpen(false)}>
                      Entrar
                    </NavLink>
                    <NavLink
                      to="/cadastro"
                      className={`${focusRing} mt-1 flex min-h-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 py-3 text-base font-semibold text-white`}
                      onClick={() => setMobileOpen(false)}
                    >
                      Criar conta
                    </NavLink>
                  </>
                )}
              </nav>
            </div>
          </>
        )}
      </header>

      <main
        id="conteudo-principal"
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-5 sm:py-12"
      >
        <Outlet />
      </main>

      <footer className="border-t border-stone-200/80 bg-stone-100/40 pb-28 sm:pb-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-center text-sm text-stone-500 sm:text-left">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-stone-600">Estante+ · projeto de portfólio</p>
            <p className="text-xs sm:text-sm">Assinatura simulada — sem cobrança real</p>
          </div>
          <nav aria-label="Informações legais e privacidade" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
            <Link
              to="/privacidade"
              className={`${focusRing} font-semibold text-amber-900 underline-offset-2 hover:underline`}
            >
              Privacidade e LGPD
            </Link>
          </nav>
          <p className="text-xs leading-relaxed text-stone-500 sm:max-w-3xl">
            Catálogo e sinopses são <strong className="font-medium text-stone-600">conteúdo de demonstração</strong>.
            Tratamento de dados pessoais segue boas práticas de transparência (LGPD) neste ambiente de estudo — veja a
            página de privacidade.
          </p>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
