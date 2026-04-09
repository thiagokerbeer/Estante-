import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { Alert } from "@/components/ui/Alert.tsx";
import { CatalogSkeleton } from "@/components/ui/CatalogSkeleton.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";

type BookCard = {
  id: string;
  title: string;
  author: string;
  isPremium: boolean;
  locked: boolean;
};

type FilterKey = "all" | "free" | "plus";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "free", label: "Grátis" },
  { key: "plus", label: "Estante+" },
];

export function CatalogPage() {
  const { token, user } = useAuth();
  const [books, setBooks] = useState<BookCard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<"title" | "author">("title");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await api<BookCard[]>("/books", { token });
        if (!cancelled) setBooks(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erro ao carregar");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const filtered = useMemo(() => {
    if (!books) return [];
    const q = query.trim().toLowerCase();
    let list = books.filter((b) => {
      const match =
        !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      if (!match) return false;
      if (filter === "free") return !b.isPremium;
      if (filter === "plus") return b.isPremium;
      return true;
    });
    list = [...list].sort((a, b) => {
      const va = (sort === "title" ? a.title : a.author).toLowerCase();
      const vb = (sort === "title" ? b.title : b.author).toLowerCase();
      return va.localeCompare(vb, "pt-BR");
    });
    return list;
  }, [books, query, filter, sort]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Catálogo"
          title="Não foi possível carregar"
          description="Verifique se a API está em execução e tente novamente."
        />
        <Alert variant="error" title="Erro de conexão">
          <p>
            {error}. Confirme o backend em{" "}
            <code className="rounded bg-red-100/80 px-1.5 py-0.5 font-mono text-xs">localhost:3001</code> e o
            comando <code className="rounded bg-red-100/80 px-1.5 py-0.5 font-mono text-xs">npm run dev</code> na
            pasta <span className="font-medium">backend</span>.
          </p>
        </Alert>
      </div>
    );
  }

  if (!books) {
    return (
      <div>
        <PageHeader
          eyebrow="Catálogo"
          title="Todos os títulos"
          description="Carregando o acervo…"
        />
        <CatalogSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catálogo"
        title="Todos os títulos"
        description={
          user?.plan === "PLUS"
            ? "Você tem acesso completo ao acervo premium."
            : "Títulos com selo Estante+ exigem assinatura para ver a sinopse completa."
        }
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative max-w-md flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar por título ou autor
          </label>
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            aria-hidden
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            id="catalog-search"
            type="search"
            placeholder="Buscar por título ou autor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${focusRing} w-full rounded-xl border border-stone-300/90 bg-white py-2.5 pl-11 pr-4 text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:border-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500/25`}
            autoComplete="off"
          />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <label htmlFor="catalog-sort" className="sr-only">
            Ordenar por
          </label>
          <select
            id="catalog-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as "title" | "author")}
            className={`${focusRing} min-h-11 rounded-xl border border-stone-300/90 bg-white px-3 py-2 text-sm font-semibold text-stone-800 shadow-sm focus-visible:border-amber-600`}
          >
            <option value="title">Ordenar: título</option>
            <option value="author">Ordenar: autor</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtrar catálogo">
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => setFilter(key)}
              className={`${focusRing} min-h-9 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                active
                  ? "bg-stone-900 text-amber-50 shadow-sm"
                  : "bg-stone-200/60 text-stone-700 hover:bg-stone-200"
              }`}
              aria-pressed={active}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-stone-500" aria-live="polite">
        {filtered.length === books.length
          ? `${books.length} livros`
          : `${filtered.length} de ${books.length} livros`}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-6 py-14 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl text-stone-800">Nada encontrado</p>
          <p className="mt-2 text-sm text-stone-600">Ajuste a busca ou troque o filtro.</p>
          <button
            type="button"
            className={`${focusRing} mt-6 text-sm font-semibold text-amber-800 hover:text-amber-900`}
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <li key={b.id}>
              <Link
                to={`/livro/${b.id}`}
                className={`${focusRing} group block overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-amber-200/90 hover:shadow-[var(--shadow-card-hover)]`}
              >
                <div
                  className="relative aspect-[3/4] bg-stone-600 transition-colors duration-300 group-hover:bg-stone-500"
                  aria-hidden
                >
                  {b.isPremium && (
                    <span className="absolute right-2 top-2 rounded-md bg-gradient-to-br from-amber-600 to-amber-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                      Estante+
                    </span>
                  )}
                  {b.locked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-stone-950/55 backdrop-blur-[3px]">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-stone-800 shadow-lg ring-1 ring-stone-200/80">
                        Exclusivo assinantes
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="font-semibold leading-snug text-stone-900 transition group-hover:text-amber-900">
                    {b.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-500">{b.author}</p>
                  <span className="mt-3 inline-flex items-center text-xs font-semibold text-amber-800 opacity-0 transition group-hover:opacity-100">
                    Ver detalhes →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
