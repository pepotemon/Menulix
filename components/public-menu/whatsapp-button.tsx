import { MessageCircle } from "lucide-react";
import { buildWhatsappUrl } from "@/lib/menu-utils";

type WhatsappButtonProps = {
  phone: string;
  restaurantName: string;
};

export function WhatsappButton({ phone, restaurantName }: WhatsappButtonProps) {
  return (
    <a
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-leaf px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-[#18765f] focus:outline-none focus:ring-4 focus:ring-leaf/20"
      href={buildWhatsappUrl(phone, restaurantName)}
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle aria-hidden="true" className="h-5 w-5" />
      Pedir pelo WhatsApp
    </a>
  );
}
