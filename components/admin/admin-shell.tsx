"use client";

import {
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Store
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { useI18n } from "@/components/language-provider";

const navItems = [
  { href: "/admin", labelKey: "admin.nav.home", icon: LayoutDashboard },
  { href: "/admin/produtos", labelKey: "admin.nav.products", icon: ClipboardList },
  { href: "/admin/categorias", labelKey: "admin.nav.categories", icon: FolderTree },
  { href: "/admin/restaurante", labelKey: "admin.nav.info", icon: Store }
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
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-line bg-white/70 px-4 py-4 md:w-64 md:border-b-0 md:border-r md:px-5 md:py-6">
          <div className="flex items-center justify-between gap-4 md:block">
            <Link href="/admin" className="block">
              <span className="block text-xl font-black">Menulix</span>
              <span className="block text-xs font-semibold text-ink/50">
                {t("admin.brand.subtitle")}
              </span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-tomato hover:text-tomato md:hidden"
              aria-label={t("admin.nav.logout")}
              title={t("admin.nav.logout")}
            >
              <LogOut size={18} />
            </button>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-leaf text-white"
                      : "text-ink/68 hover:bg-white hover:text-ink"
                  }`}
                >
                  <Icon size={18} />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-8 hidden min-h-11 w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink/68 transition hover:border-tomato hover:text-tomato md:inline-flex"
          >
            <LogOut size={18} />
            {t("admin.nav.logout")}
          </button>
        </aside>

        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</section>
      </div>
    </main>
  );
}
