import { focusRing } from "./FocusRing.tsx";

export const btnPrimary = `${focusRing} inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50`;

export const btnAccent = `${focusRing} inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-amber-500 hover:to-amber-700 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50`;

export const btnGhostDark = `${focusRing} inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-amber-50 backdrop-blur-sm transition hover:bg-white/15`;

export const btnGhost = `${focusRing} inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-stone-50 disabled:pointer-events-none disabled:opacity-50`;
