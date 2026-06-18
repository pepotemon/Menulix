"use client";

import { CalendarDays } from "lucide-react";
import { useI18n } from "@/components/language-provider";
import type { OpeningHours as OpeningHoursType } from "@/types/menu";
import { formatWeeklyOpeningHours } from "@/lib/menu-utils";

type OpeningHoursProps = {
  openingHours: OpeningHoursType;
};

export function OpeningHours({ openingHours }: OpeningHoursProps) {
  const { language, t } = useI18n();
  const weeklyHours = formatWeeklyOpeningHours(openingHours, language);

  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <CalendarDays
          aria-hidden="true"
          className="h-5 w-5 text-[var(--restaurant-primary)]"
        />
        <h2 className="text-base font-black text-ink">
          {t("public.hours.title")}
        </h2>
      </div>
      <dl className="grid gap-2 text-sm">
        {weeklyHours.map((item) => (
          <div key={item.day} className="flex items-center justify-between gap-4">
            <dt className="font-semibold text-ink/70">{item.day}</dt>
            <dd className="text-right font-bold text-ink">{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
