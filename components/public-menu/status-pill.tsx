"use client";

import { Clock3 } from "lucide-react";
import { useI18n } from "@/components/language-provider";

type StatusPillProps = {
  isOpen: boolean;
  label: string;
};

export function StatusPill({ isOpen, label }: StatusPillProps) {
  const { t } = useI18n();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/90 px-3 py-1.5 text-sm font-semibold text-ink shadow-sm backdrop-blur">
      <Clock3 aria-hidden="true" className="h-4 w-4" />
      <span
        className={
          isOpen
            ? "text-[var(--restaurant-primary)]"
            : "text-[var(--restaurant-secondary)]"
        }
      >
        {isOpen ? t("public.status.open") : t("public.status.closed")}
      </span>
      <span className="text-ink/55">•</span>
      <span className="text-ink/70">{label}</span>
    </div>
  );
}
