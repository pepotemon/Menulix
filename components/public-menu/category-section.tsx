"use client";

import type { Category, Product } from "@/types/menu";
import { useI18n } from "@/components/language-provider";
import { ProductCard } from "@/components/public-menu/product-card";

type CategorySectionProps = {
  category: Category;
  products: Product[];
};

export function CategorySection({ category, products }: CategorySectionProps) {
  const { t } = useI18n();

  if (!products.length) {
    return null;
  }

  return (
    <section id={category.id} aria-labelledby={`label-${category.id}`} className="scroll-mt-20">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2
          id={`label-${category.id}`}
          className="text-xl font-black text-[var(--restaurant-text)]"
        >
          {category.name}
        </h2>
        <span className="text-sm font-semibold text-ink/50">
          {products.length}{" "}
          {products.length === 1
            ? t("public.category.item")
            : t("public.category.items")}
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
