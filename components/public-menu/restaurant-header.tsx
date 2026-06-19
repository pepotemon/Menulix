"use client";

import Image from "next/image";
import { Instagram, MapPin } from "lucide-react";
import type { Restaurant } from "@/types/menu";
import { useI18n } from "@/components/language-provider";
import {
  getTodaysOpeningLabel,
  isRestaurantOpen
} from "@/lib/menu-utils";
import { StatusPill } from "@/components/public-menu/status-pill";
import { WhatsappButton } from "@/components/public-menu/whatsapp-button";

type RestaurantHeaderProps = {
  restaurant: Restaurant;
};

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const { language, t } = useI18n();
  const open = isRestaurantOpen(restaurant.openingHours);
  const openingLabel = getTodaysOpeningLabel(
    restaurant.openingHours,
    new Date(),
    language
  );

  return (
    <header className="relative bg-[var(--restaurant-primary)] text-white">
      <div className="absolute inset-0">
        {restaurant.bannerUrl ? (
          <Image
            priority
            alt={`Banner de ${restaurant.name}`}
            className="object-cover"
            fill
            sizes="100vw"
            src={restaurant.bannerUrl}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
      </div>

      <div className="relative mx-auto flex min-h-[360px] w-full max-w-6xl flex-col justify-end px-4 pb-6 pt-16 sm:min-h-[430px] sm:px-6 lg:px-8">
        <div className="mb-5">
          <StatusPill isOpen={open} label={openingLabel} />
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 items-end gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-4 border-white bg-white shadow-soft sm:h-24 sm:w-24">
              {restaurant.logoUrl ? (
                <Image
                  alt={`Logo de ${restaurant.name}`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 640px) 96px, 80px"
                  src={restaurant.logoUrl}
                />
              ) : null}
            </div>
            <div className="min-w-0 pb-1">
              <p className="mb-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase text-white/90 backdrop-blur">
                {t("public.header.badge")}
              </p>
              <h1 className="max-w-2xl text-3xl font-black leading-tight text-white sm:text-5xl sm:leading-none">
                {restaurant.name}
              </h1>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <WhatsappButton
              phone={restaurant.whatsapp}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-white/82 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-base leading-relaxed text-white/88">
            {restaurant.description}
          </p>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {restaurant.city}, {restaurant.state}
            </span>
            {restaurant.instagram ? (
              <span className="inline-flex items-center gap-1.5">
                <Instagram aria-hidden="true" className="h-4 w-4" />@
                {restaurant.instagram}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
