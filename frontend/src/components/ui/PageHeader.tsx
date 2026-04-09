type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, className = "" }: PageHeaderProps) {
  return (
    <header className={`max-w-2xl ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-amber-800/90">{eyebrow}</p>
      )}
      <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">{description}</p>
      )}
    </header>
  );
}
