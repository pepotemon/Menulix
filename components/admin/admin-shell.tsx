"use client";

import {
  BarChart3,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Palette,
  Store
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { useI18n } from "@/components/language-provider";

const navItems = [
  { href: "/admin", labelKey: "admin.nav.home", shortLabelKey: "admin.nav.home.short", icon: LayoutDashboard },
  { href: "/admin/produtos", labelKey: "admin.nav.products", shortLabelKey: "admin.nav.products.short", icon: ClipboardList },
  { href: "/admin/categorias", labelKey: "admin.nav.categories", shortLabelKey: "admin.nav.categories.short", icon: FolderTree },
  { href: "/admin/aparencia", labelKey: "admin.nav.appearance", shortLabelKey: "admin.nav.appearance.short", icon: Palette },
  { href: "/admin/estatisticas", labelKey: "admin.nav.analytics", shortLabelKey: "admin.nav.analytics.short", icon: BarChart3 },
  { href: "/admin/restaurante", labelKey: "admin.nav.info", shortLabelKey: "admin.nav.info.short", icon: Store }
] as const;

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOutUser } = useAuth();
  const { t } = useI18n();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && !isLoading && !user) {
      router.replace("/admin/login");
    }
  }, [isLoading, isLoginPage, router, user]);

  async function handleSignOut(): Promise<void> {
    await signOutUser();
    router.replace("/admin/login");
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 text-ink">
        <p className="text-sm font-semibold text-ink/68">
          {t("admin.loading")}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* Top header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
        <Link href="/admin" className="flex items-baseline gap-1.5">
          <span className="text-base font-black text-ink">Menulix</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink/60 transition hover:border-tomato hover:text-tomato"
          aria-label={t("admin.nav.logout")}
          title={t("admin.nav.logout")}
        >
          <LogOut size={16} />
        </button>
      </header>

      {/* Page content */}
      <div className="mx-auto max-w-5xl px-4 py-5 pb-24 sm:px-6">
        {children}
      </div>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-white/95 backdrop-blur-sm"
        aria-label="Navegação principal"
      >
        <div className="mx-auto flex max-w-5xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={t(item.labelKey)}
                aria-label={t(item.labelKey)}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-1 flex-col items-center gap-0.5 px-1 py-2.5 transition ${
                  isActive
                    ? "text-leaf"
                    : "text-ink/40 hover:text-ink"
                }`}
              >
                <Icon size={20} aria-hidden="true" />
                <span className="text-[9px] font-bold leading-none">
                  {t(item.shortLabelKey)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
