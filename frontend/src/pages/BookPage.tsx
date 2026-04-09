import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext.tsx";
import { BookSkeleton } from "@/components/ui/BookSkeleton.tsx";
import { Alert } from "@/components/ui/Alert.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";
import { btnAccent, btnPrimary } from "@/components/ui/buttons.ts";

type BookDetail = {
  id: string;
  title: string;
  author: string;
  synopsis: string | null;
  isPremium: boolean;
  locked: boolean;
};

export function BookPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await api<BookDetail>(`/books/${id}`, { token });
        if (!cancelled) setBook(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  if (error) {
    return (
      <div className="space-y-6">
        <nav className="text-sm text-stone-500" aria-label="Trilha">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className={`${focusRing} rounded font-medium text-amber-800 hover:underline`}>
                Início
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/catalogo" className={`${focusRing} rounded font-medium text-amber-800 hover:underline`}>
                Catálogo
              </Link>
            </li>
          </ol>
        </nav>
        <Alert variant="error" title="Livro indisponível">
          <p>{error}</p>
          <Link
            to="/catalogo"
            className={`${focusRing} mt-3 inline-block rounded-lg font-semibold text-red-800 underline underline-offset-2`}
          >
            Voltar ao catálogo
          </Link>
        </Alert>
      </div>
    );
  }

  if (!book) {
    return <BookSkeleton />;
  }

  const showSynopsis = Boolean(book.synopsis && !book.locked);

  return (
    <article className="mx-auto max-w-3xl">
      <nav className="text-sm text-stone-500" aria-label="Trilha">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className={`${focusRing} rounded font-medium text-amber-800 hover:underline`}>
              Início
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link to="/catalogo" className={`${focusRing} rounded font-medium text-amber-800 hover:underline`}>
              Catálogo
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="max-w-[200px] truncate font-medium text-stone-700" aria-current="page">
            {book.title}
          </li>
        </ol>
      </nav>

      <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-start">
        <div className="relative mx-auto w-full max-w-[220px] shrink-0 overflow-hidden rounded-2xl shadow-[var(--shadow-card)] md:mx-0">
          <div className="aspect-[3/4] w-full bg-stone-600" aria-hidden />
          {book.isPremium && (
            <span className="absolute right-2 top-2 rounded-md bg-gradient-to-br from-amber-600 to-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
              Estante+
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight text-stone-900 sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-stone-600">{book.author}</p>

          {!showSynopsis ? (
            <div
              className="mt-8 rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm sm:p-8"
              role="region"
              aria-labelledby="paywall-heading"
            >
              <h2 id="paywall-heading" className="font-[family-name:var(--font-display)] text-xl text-amber-950">
                Conteúdo exclusivo Estante+
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
                A sinopse completa deste título está reservada para assinantes. Entre na sua conta ou ative o plano para
                desbloquear.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {!token && (
                  <Link to="/entrar" className={`${btnPrimary} w-full sm:flex-1`}>
                    Entrar
                  </Link>
                )}
                {token && user?.plan === "FREE" && (
                  <Link to="/assinatura" className={`${btnAccent} w-full sm:flex-1`}>
                    Assinar Estante+
                  </Link>
                )}
                <Link
                  to="/catalogo"
                  className={`${focusRing} inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline`}
                >
                  Explorar outros títulos
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-base leading-[1.75] text-stone-700 sm:text-lg">{book.synopsis}</p>
          )}
        </div>
      </div>
    </article>
  );
}
