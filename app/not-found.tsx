"use client";

import Link from "next/link";
import { SearchX } from "lucide-react";
import { useI18n } from "@/components/language-provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <section className="w-full max-w-xl rounded-lg border border-line bg-white p-6 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-tomato/10 text-tomato">
          <SearchX aria-hidden="true" className="h-6 w-6" />
        </div>
        <p className="mt-5 text-sm font-bold uppercase tracking-wide text-tomato">
          {t("public.notFound.badge")}
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">
          {t("public.notFound.title")}
        </h1>
        <p className="mt-3 leading-relaxed text-ink/68">
          {t("public.notFound.description")}
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink/85"
          href="/alexpizzaria"
        >
          {t("public.notFound.example")}
        </Link>
      </section>
    </main>
  );
}
