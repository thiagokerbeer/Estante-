/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Base da API onde ficam `/covers/*` em produção (ex.: https://api.seudominio.com) */
  readonly VITE_ASSETS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
