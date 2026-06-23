"use client";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export function AdminPageHeader({
  title,
  description
}: AdminPageHeaderProps): JSX.Element {
  return (
    <header className="mb-5">
      <h1 className="text-2xl font-black text-ink sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-ink/60">
          {description}
        </p>
      ) : null}
    </header>
  );
}
