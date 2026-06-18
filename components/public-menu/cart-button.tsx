"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/public-menu/cart-provider";
import { useI18n } from "@/components/language-provider";
import { formatCurrencyBRL } from "@/lib/menu-utils";

export function CartButton(): JSX.Element | null {
  const { totalItems, totalPrice, openCart } = useCart();
  const { t } = useI18n();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0">
      <button
        type="button"
        onClick={openCart}
        className="flex items-center gap-3 rounded-full bg-[var(--restaurant-primary)] px-5 py-3 text-white shadow-soft transition hover:brightness-90"
      >
        <span className="relative">
          <ShoppingBag aria-hidden="true" className="h-5 w-5" />
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-[var(--restaurant-primary)]">
            {totalItems}
          </span>
        </span>
        <span className="text-sm font-bold">
          {t("cart.order")} · {formatCurrencyBRL(totalPrice)}
        </span>
      </button>
    </div>
  );
}
