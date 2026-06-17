"use client";

import { ClipboardList, Eye, FolderTree, Plus, Store } from "lucide-react";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PublicLinkPanel } from "@/components/admin/public-link-panel";
import { useAdminData } from "@/components/admin/admin-data-provider";

export default function AdminDashboardPage(): JSX.Element {
  const { restaurant, categories, products, isLoading, errorMessage } =
    useAdminData();

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title="Meu cardápio"
        description={errorMessage || "Carregando as informações do seu cardápio."}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Meu cardápio"
        description="Escolha o que você quer mudar. As ações principais ficam sempre à mão para facilitar o dia a dia."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            href: "/admin/produtos",
            label: "Adicionar produto",
            icon: Plus,
            primary: true
          },
          {
            href: "/admin/produtos",
            label: "Editar produtos",
            icon: ClipboardList,
            primary: false
          },
          {
            href: "/admin/categorias",
            label: "Editar categorias",
            icon: FolderTree,
            primary: false
          },
          {
            href: "/admin/restaurante",
            label: "Informações",
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
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-ink/50">Produtos</p>
          <p className="mt-2 text-3xl font-black text-ink">{products.length}</p>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-ink/50">Categorias</p>
          <p className="mt-2 text-3xl font-black text-ink">{categories.length}</p>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <p className="text-sm font-bold text-ink/50">Publicado</p>
          <p className="mt-2 flex items-center gap-2 text-lg font-black text-ink">
            <Eye size={20} />
            {restaurant.isActive ? "Sim" : "Não"}
          </p>
        </section>
      </div>

      <div className="mt-6">
        <PublicLinkPanel restaurant={restaurant} />
      </div>
    </>
  );
}
