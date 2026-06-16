import Image from "next/image";
import { BadgePercent, CircleSlash2 } from "lucide-react";
import type { Product } from "@/types/menu";
import { formatCurrencyBRL } from "@/lib/menu-utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="grid grid-cols-[88px_1fr] gap-3 rounded-lg border border-line bg-white p-3 shadow-sm sm:grid-cols-[120px_1fr] sm:gap-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
        <Image
          alt={product.name}
          className="object-cover"
          fill
          sizes="(min-width: 640px) 120px, 88px"
          src={product.imageUrl}
        />
        {product.isFeatured ? (
          <div className="absolute left-2 top-2 rounded-full bg-tomato px-2 py-1 text-white">
            <BadgePercent aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">Produto em destaque</span>
          </div>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-bold leading-tight text-ink">{product.name}</h3>
            {!product.isAvailable ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/10 px-2 py-1 text-xs font-semibold text-ink/60">
                <CircleSlash2 aria-hidden="true" className="h-3.5 w-3.5" />
                Indisp.
              </span>
            ) : null}
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-ink/68">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <strong className="text-lg font-black text-ink">
            {formatCurrencyBRL(product.price)}
          </strong>
          {product.isFeatured ? (
            <span className="rounded-full bg-tomato/10 px-2.5 py-1 text-xs font-bold text-tomato">
              Promoção
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
