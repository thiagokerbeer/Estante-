import type { ReactNode } from "react";

type Variant = "error" | "success" | "info";

const styles: Record<Variant, string> = {
  error:
    "border-red-200 bg-red-50/90 text-red-900 [&_a]:font-semibold [&_a]:text-red-800 [&_a]:underline [&_a]:underline-offset-2",
  success: "border-emerald-200 bg-emerald-50/90 text-emerald-900",
  info: "border-stone-200 bg-white/80 text-stone-800 shadow-sm",
};

export function Alert({
  variant,
  title,
  children,
  className = "",
}: {
  variant: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[variant]} ${className}`}
    >
      {title && <p className="font-semibold">{title}</p>}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}
