import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";
import { btnGhostDark } from "@/components/ui/buttons.ts";
import { focusRing } from "@/components/ui/FocusRing.tsx";

function IconBook() {
  return (
    <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function IconCode() {
  return (
    <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}

const features = [
  {
    title: "Grátis para começar",
    text: "Cadastre-se e explore títulos abertos ao plano gratuito, sem cartão.",
    icon: IconBook,
  },
  {
    title: "Premium com Estante+",
    text: "Desbloqueie o selo premium, sinopses completas e evolução para leitura integrada.",
    icon: IconSpark,
  },
  {
    title: "Stack de produto",
    text: "Front e API separados: JWT, Prisma e SQLite — pronto para escalar.",
    icon: IconCode,
  },
] as const;

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-20">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950 px-6 py-14 text-center shadow-[var(--shadow-card-hover)] sm:px-12 sm:py-20 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-stone-600/30 blur-3xl" />

        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-amber-200/90">
          Leitura inteligente
        </p>
        <h1 className="relative mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.1] tracking-tight text-amber-50 sm:text-5xl md:text-6xl">
          Sua estante,
          <br />
          <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
            um clique à frente.
          </span>
        </h1>
        <p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-amber-100/85 sm:text-lg">
          Catálogo curado com títulos gratuitos e premium. Quem assina desbloqueia o acervo completo — aqui em modo
          demonstração, sem cobrança.
        </p>
        <div className="relative mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to="/catalogo"
            className={`${focusRing} inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold text-stone-900 shadow-lg transition hover:bg-amber-300 active:scale-[0.99] sm:w-auto`}
          >
            Explorar catálogo
          </Link>
          {!user && (
            <Link to="/cadastro" className={`${btnGhostDark} w-full sm:w-auto`}>
              Criar conta grátis
            </Link>
          )}
          {user && user.plan === "FREE" && (
            <Link to="/assinatura" className={`${btnGhostDark} w-full sm:w-auto`}>
              Ver plano Estante+
            </Link>
          )}
        </div>
        <p className="relative mt-8 text-xs text-amber-200/50">
          Portfólio · dados fictícios para demonstração de UX
        </p>
      </section>

      <section>
        <div className="mb-10 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-stone-900 sm:text-3xl">
            Por que Estante+?
          </h2>
          <p className="mt-2 text-stone-600">Três pilares pensados para conversão e clareza.</p>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {features.map(({ title, text, icon: Icon }) => (
            <li
              key={title}
              className="group flex flex-col rounded-2xl border border-stone-200/90 bg-white/80 p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-amber-200/80 hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100 transition group-hover:bg-amber-100/80">
                <Icon />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl text-stone-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{text}</p>
              <Link
                to="/catalogo"
                className={`${focusRing} mt-5 inline-flex text-sm font-semibold text-amber-800 hover:text-amber-900`}
              >
                Ver livros →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
