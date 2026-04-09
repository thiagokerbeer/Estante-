import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import { useAuth } from "@/context/AuthContext.tsx";
import { PageHeader } from "@/components/ui/PageHeader.tsx";
import { Alert } from "@/components/ui/Alert.tsx";
import { focusRing } from "@/components/ui/FocusRing.tsx";
import { btnPrimary } from "@/components/ui/buttons.ts";
import { Spinner } from "@/components/ui/Spinner.tsx";

type PrivacyNotice = {
  version: string;
  project: string;
  controller: string;
  lgpdLaw?: string;
  lgpdInPractice?: { article: string; summary: string }[];
  purpose: string;
  dataCategories: { category: string; items: string[] }[];
  legalBases: string[];
  retention: string;
  rights: string[];
  security: string;
  contact: string;
  disclaimer?: string;
  lastUpdated: string;
};

type DataExport = {
  exportedAt: string;
  privacyNoticeUrl: string;
  user: {
    id: string;
    email: string;
    plan: string;
    planEndsAt: string | null;
    createdAt: string;
    privacyNoticeAcceptedAt: string | null;
  };
};

export function PrivacidadePage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<PrivacyNotice | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingNotice(true);
      setLoadError(null);
      try {
        const data = await api<PrivacyNotice>("/legal/privacy-notice");
        if (!cancelled) setNotice(data);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : "Não foi possível carregar o aviso da API.");
      } finally {
        if (!cancelled) setLoadingNotice(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const downloadMyData = useCallback(async () => {
    if (!token) return;
    setActionMsg(null);
    setExporting(true);
    try {
      const data = await api<DataExport>("/auth/data-export", { token });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `estante-plus-meus-dados-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setActionMsg("Arquivo JSON gerado com os dados da sua conta (portabilidade — art. 18, LGPD).");
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Falha ao exportar.");
    } finally {
      setExporting(false);
    }
  }, [token]);

  const deleteAccount = useCallback(async () => {
    if (!token) return;
    const ok = window.confirm(
      "Excluir sua conta e os dados pessoais deste app (direito ao esquecimento — escopo deste projeto)? Esta ação não pode ser desfeita."
    );
    if (!ok) return;
    setActionMsg(null);
    setDeleting(true);
    try {
      await api("/auth/me", { method: "DELETE", token });
      logout();
      navigate("/", { replace: true });
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Não foi possível excluir a conta.");
    } finally {
      setDeleting(false);
    }
  }, [token, logout, navigate]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="LGPD · Privacidade"
        title="Proteção de dados no Estante+"
        description="Página de demonstração para portfólio: o que é a LGPD, como este projeto aplica boas práticas técnicas (consentimento, transparência, direitos do titular) e o que a API expõe para auditoria didática."
      />

      <section className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-6 shadow-sm sm:p-8">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">O que é a LGPD?</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-700 sm:text-base">
          A <strong className="font-medium text-stone-900">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</strong>{" "}
          disciplina o tratamento de dados pessoais no Brasil, com princípios como finalidade, necessidade,
          transparência e segurança. Organizações precisam informar titulares, ter bases legais para tratar dados e
          respeitar direitos como acesso, correção e eliminação, conforme o caso.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
          Este repositório é um <strong className="font-medium text-stone-800">ambiente de estudo</strong>: o código
          mostra padrões úteis (registro de consentimento no cadastro, endpoint de aviso, exportação e exclusão de
          conta), mas <strong className="font-medium text-stone-800">não substitui</strong> política jurídica completa,
          DPO/encarregado ou análise para produção.
        </p>
      </section>

      {token && user && (
        <section
          className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8"
          aria-labelledby="titular-heading"
        >
          <h2 id="titular-heading" className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Você está logado — direitos do titular (demo)
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Conta: <span className="font-medium text-stone-800">{user.email}</span>
            {user.privacyNoticeAcceptedAt && (
              <>
                {" "}
                · Aceite do aviso registrado em{" "}
                <time dateTime={user.privacyNoticeAcceptedAt}>
                  {new Date(user.privacyNoticeAcceptedAt).toLocaleString("pt-BR")}
                </time>
              </>
            )}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={exporting}
              onClick={() => void downloadMyData()}
              className={`${btnPrimary} inline-flex items-center justify-center gap-2`}
            >
              {exporting && <Spinner className="h-5 w-5 text-white" />}
              {exporting ? "Gerando…" : "Baixar meus dados (JSON)"}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={() => void deleteAccount()}
              className={`${focusRing} inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-red-200 bg-red-50/80 px-5 py-3 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:opacity-60`}
            >
              {deleting ? "Excluindo…" : "Excluir minha conta"}
            </button>
          </div>
          {actionMsg && (
            <p className="mt-4 text-sm text-stone-600" role="status">
              {actionMsg}
            </p>
          )}
        </section>
      )}

      <section className="space-y-4">
        <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">Aviso estruturado (API)</h2>
        <p className="text-sm text-stone-600">
          O backend expõe <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">GET /legal/privacy-notice</code>{" "}
          em JSON — padrão útil para apps que precisam versionar texto e integrar web + mobile.
        </p>

        {loadingNotice && (
          <div className="flex items-center gap-2 text-sm text-stone-500" role="status">
            <Spinner className="h-5 w-5 text-amber-700" />
            Carregando aviso da API…
          </div>
        )}

        {loadError && (
          <Alert variant="error" title="API indisponível">
            <p>{loadError}</p>
          </Alert>
        )}

        {notice && !loadingNotice && (
          <div className="space-y-6 rounded-2xl border border-stone-200/90 bg-stone-50/50 p-6 sm:p-8">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-stone-800">Projeto</dt>
                <dd className="mt-1 text-stone-600">{notice.project}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-800">Versão do aviso</dt>
                <dd className="mt-1 text-stone-600">{notice.version}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-stone-800">Controlador (demo)</dt>
                <dd className="mt-1 text-stone-600">{notice.controller}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="font-semibold text-stone-800">Finalidade</dt>
                <dd className="mt-1 text-stone-600">{notice.purpose}</dd>
              </div>
            </dl>

            {notice.lgpdLaw && notice.lgpdInPractice && notice.lgpdInPractice.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-amber-900/90">{notice.lgpdLaw}</h3>
                <ul className="mt-3 space-y-3 text-sm text-stone-700">
                  {notice.lgpdInPractice.map((row) => (
                    <li key={row.article} className="border-l-2 border-amber-400/80 pl-3">
                      <span className="font-semibold text-stone-900">{row.article}:</span> {row.summary}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Categorias de dados</h3>
              <ul className="mt-2 space-y-3 text-sm text-stone-700">
                {notice.dataCategories.map((c) => (
                  <li key={c.category}>
                    <span className="font-medium text-stone-800">{c.category}:</span> {c.items.join(", ")}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Bases legais (resumo)</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-stone-700">
                {notice.legalBases.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Retenção</h3>
              <p className="mt-2 text-sm text-stone-700">{notice.retention}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Direitos e ferramentas neste app</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-stone-700">
                {notice.rights.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Segurança (visão técnica)</h3>
              <p className="mt-2 text-sm text-stone-700">{notice.security}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-stone-900">Contato</h3>
              <p className="mt-2 text-sm text-stone-700">{notice.contact}</p>
            </div>

            {notice.disclaimer && (
              <p className="border-t border-stone-200 pt-4 text-xs leading-relaxed text-stone-500">{notice.disclaimer}</p>
            )}

            <p className="text-xs text-stone-500">
              Última atualização do documento da API:{" "}
              <time dateTime={notice.lastUpdated}>{notice.lastUpdated}</time>
            </p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-6 text-sm text-stone-600">
        <h2 className="font-semibold text-stone-900">Checklist técnico (portfólio)</h2>
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          <li>Consentimento explícito no cadastro com armazenamento de data de aceite.</li>
          <li>Aviso de privacidade versionado e consumível por máquina (JSON).</li>
          <li>Portabilidade: exportação dos dados do titular em formato estruturado.</li>
          <li>Eliminação: exclusão da conta e dados associados no escopo do sistema.</li>
          <li>Transparência no front: página dedicada + aviso sobre armazenamento local da sessão.</li>
        </ul>
      </section>
    </div>
  );
}
