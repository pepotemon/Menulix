interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export function AdminPageHeader({
  title,
  description
}: AdminPageHeaderProps): JSX.Element {
  return (
    <header className="mb-6">
      <p className="text-xs font-bold uppercase tracking-normal text-leaf">
        Fase 2
      </p>
      <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">
        {description}
      </p>
    </header>
  );
}
