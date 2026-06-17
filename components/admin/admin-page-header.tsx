"use client";

import { useI18n } from "@/components/language-provider";

interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export function AdminPageHeader({
  title,
  description
}: AdminPageHeaderProps): JSX.Element {
  const { t } = useI18n();

  return (
    <header className="mb-6">
      <p className="text-xs font-bold uppercase tracking-normal text-leaf">
        {t("admin.common.phase")}
      </p>
      <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/68">
        {description}
      </p>
    </header>
  );
}
