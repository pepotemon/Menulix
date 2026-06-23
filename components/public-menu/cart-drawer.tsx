"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/public-menu/cart-provider";
import { useI18n } from "@/components/language-provider";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { buildWhatsappOrderUrl, formatCurrencyBRL } from "@/lib/menu-utils";

type CartDrawerProps = {
  phone: string;
  restaurantId: string;
};

export function CartDrawer({
  phone,
  restaurantId
}: CartDrawerProps): JSX.Element | null {
  const { items, totalPrice, isOpen, closeCart, addItem, removeItem, clearCart } = useCart();
  const { t, language } = useI18n();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) return null;

  const orderUrl = buildWhatsappOrderUrl(phone, items, language);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside
        aria-label={t("cart.title")}
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-sm animate-[slideIn_.2s_ease-out] flex-col bg-cream shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag aria-hidden="true" className="h-5 w-5 text-[var(--restaurant-primary)]" />
            <h2 className="text-base font-black text-ink">{t("cart.title")}</h2>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-ink/50 transition hover:text-tomato"
              >
                {t("cart.clear")}
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink/60 transition hover:bg-line"
              aria-label={t("admin.common.close")}
              title={t("admin.common.close")}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag aria-hidden="true" className="h-10 w-10 text-ink/20" />
              <p className="font-bold text-ink/50">{t("cart.empty")}</p>
              <p className="text-sm text-ink/40">{t("cart.emptyDescription")}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 rounded-lg border border-line bg-white p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-tight text-ink">{product.name}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--restaurant-primary)]">
                      {formatCurrencyBRL(product.price * quantity)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label={`Remover ${product.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-cream text-ink transition hover:border-tomato hover:text-tomato"
                    >
                      <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-black text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => addItem(product)}
                      aria-label={`Adicionar ${product.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-cream text-ink transition hover:border-[var(--restaurant-primary)] hover:text-[var(--restaurant-primary)]"
                    >
                      <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t border-line px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink/68">{t("cart.total")}</span>
              <strong className="text-lg font-black text-ink">
                {formatCurrencyBRL(totalPrice)}
              </strong>
            </div>
            <a
              href={orderUrl}
              onClick={() => {
                void trackAnalyticsEvent({
                  restaurantId,
                  type: "cart_order_sent",
                  total: totalPrice,
                  itemCount: items.reduce((total, item) => total + item.quantity, 0),
                  language
                });
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--restaurant-primary)] px-4 py-3 text-sm font-bold text-white transition hover:brightness-90"
            >
              {t("cart.order")}
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
