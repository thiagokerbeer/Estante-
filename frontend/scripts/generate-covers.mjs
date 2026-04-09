/**
 * Gera SVGs de capa fictícia em frontend/public/covers e backend/public/covers
 * (a API serve /covers/* para o front montar URL absoluta em dev).
 * Rode: node scripts/generate-covers.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "covers");
const backendCoversDir = path.join(__dirname, "..", "..", "backend", "public", "covers");

/** Ordem alinhada ao prisma/seed.ts — [slug, premium] */
const items = [
  ["o-pequeno-principe", false],
  ["ano-1984", true],
  ["dom-casmurro", false],
  ["sapiens", true],
  ["a-metamorfose", false],
  ["cem-anos-de-solidao", true],
  ["o-alquimista", false],
  ["capitaes-da-areia", false],
  ["orgulho-e-preconceito", false],
  ["o-alienista", false],
  ["a-hora-da-estrela", false],
  ["o-morro-dos-ventos-uivantes", false],
  ["memorias-postumas-bras-cubas", false],
  ["o-cortico", false],
  ["grande-sertao-veredas", true],
  ["a-revolucao-dos-bichos", true],
  ["o-senhor-dos-aneis", true],
  ["duna", true],
  ["o-poder-do-habito", true],
  ["mindset", true],
  ["o-nome-da-rosa", true],
  ["a-arte-da-guerra", true],
  ["o-homem-mais-rico-da-babilonia", true],
  ["o-cacador-de-pipas", true],
  ["a-culpa-e-das-estrelas", false],
  ["o-hobbit", true],
  ["fundacao", true],
  ["o-conto-da-aia", true],
  ["o-velho-e-o-mar", false],
  ["a-insustentavel-leveza-do-ser", true],
  ["iracema", false],
  ["o-diario-de-anne-frank", false],
];

function svg(slug, premium, index) {
  const h1 = (index * 41 + 22) % 360;
  const h2 = (h1 + 48) % 360;
  const band = premium ? "#d97706" : "rgba(255,255,255,0.14)";
  const bandOpacity = premium ? 0.92 : 1;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 420" width="280" height="420" role="img" aria-label="Capa ilustrativa fictícia para portfólio">
  <defs>
    <linearGradient id="bg-${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="hsl(${h1}, 38%, 28%)"/>
      <stop offset="55%" stop-color="hsl(${h2}, 36%, 20%)"/>
      <stop offset="100%" stop-color="hsl(${(h2 + 25) % 360}, 32%, 14%)"/>
    </linearGradient>
  </defs>
  <rect width="280" height="420" fill="url(#bg-${slug})"/>
  <rect x="0" y="0" width="280" height="10" fill="${band}" opacity="${bandOpacity}"/>
  <rect x="20" y="48" width="240" height="3" fill="#ffffff" opacity="0.12"/>
  <rect x="20" y="58" width="160" height="3" fill="#ffffff" opacity="0.08"/>
  <g opacity="0.18" fill="none" stroke="#ffffff" stroke-width="1.2">
    <rect x="56" y="120" width="168" height="210" rx="3"/>
    <line x1="72" y1="148" x2="208" y2="148"/>
    <line x1="72" y1="168" x2="196" y2="168"/>
    <line x1="72" y1="188" x2="200" y2="188"/>
  </g>
  <text x="140" y="360" text-anchor="middle" fill="#ffffff" opacity="0.5" font-family="Segoe UI,system-ui,sans-serif" font-size="11" font-weight="600">Capa ilustrativa</text>
  <text x="140" y="378" text-anchor="middle" fill="#ffffff" opacity="0.42" font-family="Segoe UI,system-ui,sans-serif" font-size="9">Apenas portfólio — não reproduz capa comercial</text>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(backendCoversDir, { recursive: true });
for (let i = 0; i < items.length; i++) {
  const [slug, premium] = items[i];
  const content = svg(slug, premium, i);
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), content, "utf8");
  fs.writeFileSync(path.join(backendCoversDir, `${slug}.svg`), content, "utf8");
}
console.log(`Gerados ${items.length} SVGs em ${outDir} e ${backendCoversDir}`);
