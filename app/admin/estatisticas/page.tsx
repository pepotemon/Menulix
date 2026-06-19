"use client";

import { BarChart3, Eye, MessageCircle, MousePointerClick, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { getRestaurantAnalytics } from "@/lib/analytics";
import { formatCurrencyBRL } from "@/lib/menu-utils";
import type { AnalyticsEvent, AnalyticsSummary, AnalyticsEventType } from "@/types/menu";

const EMPTY_ANALYTICS: AnalyticsSummary = {
  menuViews: 0,
  categoryClicks: 0,
  productClicks: 0,
  whatsappClicks: 0,
  cartOrdersSent: 0,
  estimatedRevenue: 0,
  topProducts: [],
  recentEvents: []
};

export default function AdminAnalyticsPage(): JSX.Element {
  const { restaurant, isLoading: isMenuLoading, errorMessage } = useAdminData();
  const { language, t } = useI18n();
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(EMPTY_ANALYTICS);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!restaurant) return;
    const restaurantId = restaurant.id;

    async function loadAnalytics(): Promise<void> {
      setIsLoading(true);
      setLoadError("");

      try {
        const data = await getRestaurantAnalytics(restaurantId);
        setAnalytics(data);
      } catch {
        setLoadError(t("admin.analytics.loadError"));
      } finally {
        setIsLoading(false);
      }
    }

    void loadAnalytics();
  }, [restaurant, t]);

  if (isMenuLoading || !restaurant) {
    return (
      <AdminPageHeader
        title={t("admin.analytics.title")}
        description={errorMessage || t("admin.data.loadError")}
      />
    );
  }

  const cards = [
    {
      label: t("admin.analytics.menuViews"),
      value: analytics.menuViews,
      icon: Eye
    },
    {
      label: t("admin.analytics.productClicks"),
      value: analytics.productClicks,
      icon: MousePointerClick
    },
    {
      label: t("admin.analytics.whatsappClicks"),
      value: analytics.whatsappClicks,
      icon: MessageCircle
    },
    {
      label: t("admin.analytics.ordersSent"),
      value: analytics.cartOrdersSent,
      icon: Send
    }
  ];

  return (
    <>
      <AdminPageHeader
        title={t("admin.analytics.title")}
        description={t("admin.analytics.description")}
      />

      {loadError ? (
        <p className="mb-4 rounded-md border border-tomato/20 bg-tomato/10 px-4 py-3 text-sm font-semibold text-tomato">
          {loadError}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <section
              key={card.label}
              className="rounded-md border border-line bg-white p-5 shadow-soft"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink/50">{card.label}</p>
                <Icon aria-hidden="true" className="h-5 w-5 text-leaf" />
              </div>
              <p className="mt-3 text-3xl font-black text-ink">
                {isLoading ? "..." : card.value}
              </p>
            </section>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <BarChart3 aria-hidden="true" className="h-5 w-5 text-leaf" />
            <h2 className="text-base font-black text-ink">
              {t("admin.analytics.topProducts")}
            </h2>
          </div>

          {analytics.topProducts.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {analytics.topProducts.map((product, index) => (
                <li
                  key={product.productId}
                  className="flex items-center justify-between gap-3 rounded-md border border-line bg-cream px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-ink">
                      {index + 1}. {product.productName}
                    </p>
                    <p className="text-xs font-semibold text-ink/50">
                      {product.clicks} {t("admin.analytics.clicks")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm font-semibold text-ink/50">
              {t("admin.analytics.emptyProducts")}
            </p>
          )}
        </section>

        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-ink/50">
            {t("admin.analytics.estimatedRevenue")}
          </p>
          <p className="mt-2 text-3xl font-black text-ink">
            {formatCurrencyBRL(analytics.estimatedRevenue)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {t("admin.analytics.estimatedRevenueHelp")}
          </p>
        </section>
      </div>

      <section className="mt-6 rounded-md border border-line bg-white p-5 shadow-soft">
        <h2 className="text-base font-black text-ink">
          {t("admin.analytics.recentActivity")}
        </h2>

        {analytics.recentEvents.length > 0 ? (
          <ul className="mt-4 divide-y divide-line">
            {analytics.recentEvents.map((event) => (
              <li key={event.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">
                    {getEventLabel(event.type, t)}
                  </p>
                  <p className="truncate text-xs font-semibold text-ink/50">
                    {getEventDetail(event, t)}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-semibold text-ink/40">
                  {formatEventDate(event.createdAt, language)}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm font-semibold text-ink/50">
            {t("admin.analytics.emptyActivity")}
          </p>
        )}
      </section>
    </>
  );
}

function getEventLabel(
  type: AnalyticsEventType,
  t: (key: "admin.analytics.event.menuView" | "admin.analytics.event.categoryClick" | "admin.analytics.event.productClick" | "admin.analytics.event.whatsappClick" | "admin.analytics.event.cartOrderSent") => string
): string {
  const labels = {
    menu_view: "admin.analytics.event.menuView",
    category_click: "admin.analytics.event.categoryClick",
    product_click: "admin.analytics.event.productClick",
    whatsapp_click: "admin.analytics.event.whatsappClick",
    cart_order_sent: "admin.analytics.event.cartOrderSent"
  } as const;

  return t(labels[type]);
}

function getEventDetail(
  event: AnalyticsEvent,
  t: (key: "admin.analytics.noDetail") => string
): string {
  return event.productName ?? event.categoryName ?? t("admin.analytics.noDetail");
}

function formatEventDate(value: string, language: string): string {
  return new Intl.DateTimeFormat(language === "es" ? "es-ES" : "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
