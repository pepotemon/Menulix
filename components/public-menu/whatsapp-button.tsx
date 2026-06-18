"use client";

import { MessageCircle } from "lucide-react";
import { useI18n } from "@/components/language-provider";
import { buildWhatsappUrl } from "@/lib/menu-utils";

type WhatsappButtonProps = {
  phone: string;
  restaurantName: string;
};

export function WhatsappButton({ phone, restaurantName }: WhatsappButtonProps) {
  const { language, t } = useI18n();

  return (
    <a
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--restaurant-primary)] px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:brightness-90 focus:outline-none focus:ring-4 focus:ring-leaf/20"
      href={buildWhatsappUrl(phone, restaurantName, language)}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      {t("public.whatsapp")}
    </a>
  );
}
