import type { Category, Product } from "@/types/menu";
import { ProductCard } from "@/components/public-menu/product-card";

type CategorySectionProps = {
  category: Category;
  products: Product[];
};

export function CategorySection({ category, products }: CategorySectionProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section aria-labelledby={category.id} className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 id={category.id} className="text-xl font-black text-ink">
          {category.name}
        </h2>
        <span className="text-sm font-semibold text-ink/50">
          {products.length} {products.length === 1 ? "item" : "itens"}
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
