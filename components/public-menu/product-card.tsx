"use client";

import Image from "next/image";
import { BadgePercent, CircleSlash2, ImageIcon, Minus, Plus } from "lucide-react";
import { useI18n } from "@/components/language-provider";
import { useCart } from "@/components/public-menu/cart-provider";
import type { Product } from "@/types/menu";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { formatCurrencyBRL } from "@/lib/menu-utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useI18n();
  const { items, addItem, removeItem } = useCart();

  const cartItem = items.find((item) => item.product.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <article className="grid grid-cols-[88px_1fr] gap-3 rounded-lg border border-line bg-white p-3 shadow-sm sm:grid-cols-[120px_1fr] sm:gap-4">
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
        {product.imageUrl ? (
          <Image
            alt={product.name}
            className="object-cover"
            fill
            sizes="(min-width: 640px) 120px, 88px"
            src={product.imageUrl}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink/35">
            <ImageIcon aria-hidden="true" className="h-5 w-5" />
            <span className="text-lg font-black">
              {product.name.trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {product.isFeatured ? (
          <div className="absolute left-2 top-2 rounded-full bg-[var(--restaurant-secondary)] px-2 py-1 text-white">
            <BadgePercent aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="sr-only">{t("public.featuredSr")}</span>
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
                {t("public.unavailableShort")}
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

          {product.isAvailable && (
            <div className="flex items-center gap-2">
              {quantity > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remover ${product.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-cream text-ink transition hover:border-tomato hover:text-tomato"
                  >
                    <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-black text-ink">
                    {quantity}
                  </span>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  addItem(product);
                  void trackAnalyticsEvent({
                    restaurantId: product.restaurantId,
                    type: "product_click",
                    productId: product.id,
                    productName: product.name,
                    categoryId: product.categoryId,
                    language
                  });
                }}
                aria-label={`${t("cart.add")} ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--restaurant-primary)] text-white transition hover:brightness-90"
              >
                <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
