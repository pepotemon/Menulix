"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/language-provider";
import { trackAnalyticsEvent } from "@/lib/analytics";
import type { Category } from "@/types/menu";

interface CategoryNavProps {
  categories: Category[];
  restaurantId: string;
}

export function CategoryNav({
  categories,
  restaurantId
}: CategoryNavProps): JSX.Element {
  const { language, t } = useI18n();
  const [activeCategoryId, setActiveCategoryId] = useState(
    categories[0]?.id ?? ""
  );

  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(category.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveCategoryId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0.05, 0.25, 0.5]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="sticky top-0 z-20 border-b border-line bg-[var(--restaurant-bg)]/95 backdrop-blur">
      <nav
        aria-label={t("public.category.nav")}
        className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <a
              key={category.id}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${
                isActive
                  ? "border-[var(--restaurant-primary)] bg-[var(--restaurant-primary)] text-white"
                  : "border-line bg-white text-[var(--restaurant-text)] hover:border-[var(--restaurant-secondary)] hover:text-[var(--restaurant-secondary)]"
              }`}
              href={`#${category.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => {
                setActiveCategoryId(category.id);
                void trackAnalyticsEvent({
                  restaurantId,
                  type: "category_click",
                  categoryId: category.id,
                  categoryName: category.name,
                  language
                });
              }}
            >
              {category.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

