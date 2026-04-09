import type { ReactNode } from "react";

export function AuthPanel({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-stone-200/90 bg-white/90 p-8 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-10">
        {children}
      </div>
    </div>
  );
}
