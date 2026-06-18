"use client";

import type { CSSProperties } from "react";
import type { PublicMenu } from "@/types/menu";
import { useI18n } from "@/components/language-provider";
import { CategorySection } from "@/components/public-menu/category-section";
import { OpeningHours } from "@/components/public-menu/opening-hours";
import { RestaurantHeader } from "@/components/public-menu/restaurant-header";
import { WhatsappButton } from "@/components/public-menu/whatsapp-button";

type PublicMenuPageProps = {
  menu: PublicMenu;
};

export function PublicMenuPage({ menu }: PublicMenuPageProps) {
  const { t } = useI18n();
  const { restaurant, categories, products } = menu;
  const themeStyle = {
    "--restaurant-primary": restaurant.theme.primaryColor,
    "--restaurant-secondary": restaurant.theme.secondaryColor,
    "--restaurant-bg": restaurant.theme.backgroundColor,
    "--restaurant-text": restaurant.theme.textColor
  } as CSSProperties;

  return (
    <main
      className="min-h-screen bg-[var(--restaurant-bg)] text-[var(--restaurant-text)]"
      style={themeStyle}
    >
      <RestaurantHeader restaurant={restaurant} />

      <div className="sticky top-0 z-10 border-b border-line bg-[var(--restaurant-bg)] backdrop-blur">
        <nav
          aria-label={t("public.category.nav")}
          className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
        >
          {categories.map((category) => (
            <a
              key={category.id}
              className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-bold text-[var(--restaurant-text)] transition hover:border-[var(--restaurant-secondary)] hover:text-[var(--restaurant-secondary)]"
              href={`#${category.id}`}
            >
              {category.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="space-y-8">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              products={products.filter((product) => product.categoryId === category.id)}
            />
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <OpeningHours openingHours={restaurant.openingHours} />
          <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-base font-black text-[var(--restaurant-text)]">
              {t("public.order.title")}
            </h2>
            <p className="mb-4 mt-2 text-sm leading-relaxed text-ink/68">
              {t("public.order.description")}
            </p>
            <WhatsappButton
              phone={restaurant.whatsapp}
              restaurantName={restaurant.name}
            />
          </section>
        </aside>
      </div>
    </main>
  );
}
