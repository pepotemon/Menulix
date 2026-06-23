"use client";

import {
  BarChart3,
  ClipboardList,
  Eye,
  FolderTree,
  Palette,
  Plus,
  Store
} from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PublicLinkPanel } from "@/components/admin/public-link-panel";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Panel } from "@/components/ui/panel";

export default function AdminDashboardPage(): JSX.Element {
  const { restaurant, categories, products, isLoading, errorMessage } =
    useAdminData();
  const { t } = useI18n();

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title={t("admin.dashboard.title")}
        description={errorMessage || t("admin.data.loadError")}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title={t("admin.dashboard.title")}
        description={t("admin.dashboard.description")}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: "/admin/produtos",
            label: t("admin.dashboard.addProduct"),
            icon: Plus,
            primary: true
          },
          {
            href: "/admin/produtos",
            label: t("admin.dashboard.editProducts"),
            icon: ClipboardList,
            primary: false
          },
          {
            href: "/admin/categorias",
            label: t("admin.dashboard.editCategories"),
            icon: FolderTree,
            primary: false
          },
          {
            href: "/admin/aparencia",
            label: t("admin.dashboard.editAppearance"),
            icon: Palette,
            primary: false
          },
          {
            href: "/admin/estatisticas",
            label: t("admin.dashboard.analytics"),
            icon: BarChart3,
            primary: false
          },
          {
            href: "/admin/restaurante",
            label: t("admin.dashboard.info"),
            icon: Store,
            primary: false
          }
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex min-h-24 items-center gap-3 rounded-md border p-4 shadow-soft transition ${
              item.primary
                ? "border-leaf bg-leaf text-white hover:bg-ink"
                : "border-line bg-white text-ink hover:border-leaf"
            }`}
          >
            <item.icon size={24} />
            <span className="text-base font-black">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Panel>
          <p className="text-sm font-bold text-ink/50">
            {t("admin.dashboard.products")}
          </p>
          <p className="mt-2 text-3xl font-black text-ink">{products.length}</p>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-ink/50">
            {t("admin.dashboard.categories")}
          </p>
          <p className="mt-2 text-3xl font-black text-ink">{categories.length}</p>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-ink/50">
            {t("admin.dashboard.published")}
          </p>
          <p className="mt-2 flex items-center gap-2 text-lg font-black text-ink">
            <Eye size={20} />
            {restaurant.isActive
              ? t("admin.dashboard.yes")
              : t("admin.dashboard.no")}
          </p>
        </Panel>
      </div>

      <div className="mt-6">
        <PublicLinkPanel restaurant={restaurant} />
      </div>
    </>
  );
}
