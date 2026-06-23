"use client";

import {
  BarChart3,
  ClipboardList,
  Eye,
  EyeOff,
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

  const quickActions = [
    { href: "/admin/produtos", label: t("admin.dashboard.addProduct"), icon: Plus, primary: true },
    { href: "/admin/produtos", label: t("admin.dashboard.editProducts"), icon: ClipboardList, primary: false },
    { href: "/admin/categorias", label: t("admin.dashboard.editCategories"), icon: FolderTree, primary: false },
    { href: "/admin/aparencia", label: t("admin.dashboard.editAppearance"), icon: Palette, primary: false },
    { href: "/admin/estatisticas", label: t("admin.dashboard.analytics"), icon: BarChart3, primary: false },
    { href: "/admin/restaurante", label: t("admin.dashboard.info"), icon: Store, primary: false }
  ];

  return (
    <>
      <AdminPageHeader title={t("admin.dashboard.title")} />

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-line bg-white px-3 py-2.5">
          <p className="text-[11px] font-semibold text-ink/50">
            {t("admin.dashboard.products")}
          </p>
          <p className="mt-0.5 text-lg font-black text-ink">{products.length}</p>
        </div>
        <div className="rounded-lg border border-line bg-white px-3 py-2.5">
          <p className="text-[11px] font-semibold text-ink/50">
            {t("admin.dashboard.categories")}
          </p>
          <p className="mt-0.5 text-lg font-black text-ink">{categories.length}</p>
        </div>
        <div className="rounded-lg border border-line bg-white px-3 py-2.5">
          <p className="text-[11px] font-semibold text-ink/50">
            {t("admin.dashboard.published")}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-black text-ink">
            {restaurant.isActive ? (
              <>
                <Eye size={14} className="text-leaf" />
                {t("admin.dashboard.yes")}
              </>
            ) : (
              <>
                <EyeOff size={14} className="text-ink/40" />
                {t("admin.dashboard.no")}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Link panel */}
      <PublicLinkPanel restaurant={restaurant} />

      {/* Quick actions */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {quickActions.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg border px-3 py-3 text-sm font-black transition ${
              item.primary
                ? "border-leaf bg-leaf text-white hover:bg-ink"
                : "border-line bg-white text-ink hover:border-leaf"
            }`}
          >
            <item.icon size={16} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
