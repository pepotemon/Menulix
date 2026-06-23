"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { saveRestaurant, slugifyRestaurantName } from "@/lib/admin-firestore";
import type { OpeningHours, RestaurantFormInput } from "@/types/menu";

const emptyForm: RestaurantFormInput = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
  bannerUrl: "",
  whatsapp: "",
  instagram: "",
  address: "",
  city: "",
  state: "",
  isActive: false,
  openingHours: {}
};

function buildOpeningHours(
  weekdaysOpen: string,
  weekdaysClose: string,
  saturdayOpen: string,
  saturdayClose: string,
  sundayOpen: string,
  sundayClose: string
): OpeningHours {
  const hours: OpeningHours = {};

  if (weekdaysOpen && weekdaysClose) {
    ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach((day) => {
      hours[day as keyof OpeningHours] = [
        { opens: weekdaysOpen, closes: weekdaysClose }
      ];
    });
  }

  if (saturdayOpen && saturdayClose) {
    hours.saturday = [{ opens: saturdayOpen, closes: saturdayClose }];
  }

  if (sundayOpen && sundayClose) {
    hours.sunday = [{ opens: sundayOpen, closes: sundayClose }];
  }

  return hours;
}

export default function AdminRestaurantPage(): JSX.Element {
  const { restaurant, isLoading, errorMessage, refresh } = useAdminData();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [form, setForm] = useState<RestaurantFormInput>(emptyForm);
  const [weekdaysOpen, setWeekdaysOpen] = useState("");
  const [weekdaysClose, setWeekdaysClose] = useState("");
  const [saturdayOpen, setSaturdayOpen] = useState("");
  const [saturdayClose, setSaturdayClose] = useState("");
  const [sundayOpen, setSundayOpen] = useState("");
  const [sundayClose, setSundayClose] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!restaurant) return;

    setForm({
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description,
      logoUrl: restaurant.logoUrl,
      bannerUrl: restaurant.bannerUrl,
      whatsapp: restaurant.whatsapp,
      instagram: restaurant.instagram ?? "",
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      isActive: restaurant.isActive,
      openingHours: restaurant.openingHours
    });
    setWeekdaysOpen(restaurant.openingHours.monday?.[0]?.opens ?? "");
    setWeekdaysClose(restaurant.openingHours.monday?.[0]?.closes ?? "");
    setSaturdayOpen(restaurant.openingHours.saturday?.[0]?.opens ?? "");
    setSaturdayClose(restaurant.openingHours.saturday?.[0]?.closes ?? "");
    setSundayOpen(restaurant.openingHours.sunday?.[0]?.opens ?? "");
    setSundayClose(restaurant.openingHours.sunday?.[0]?.closes ?? "");
  }, [restaurant]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!restaurant) return;

    setIsSaving(true);

    try {
      await saveRestaurant(restaurant.id, {
        ...form,
        slug: slugifyRestaurantName(form.slug || form.name),
        openingHours: buildOpeningHours(
          weekdaysOpen,
          weekdaysClose,
          saturdayOpen,
          saturdayClose,
          sundayOpen,
          sundayClose
        )
      });
      await refresh();
      showToast(t("admin.restaurant.saved"), "success");
    } catch {
      showToast(t("admin.restaurant.saveError"), "error");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title={t("admin.restaurant.title")}
        description={errorMessage || t("admin.restaurant.loading")}
      />
    );
  }

  const hourRows = [
    { label: t("admin.restaurant.weekdays"), openVal: weekdaysOpen, setOpen: setWeekdaysOpen, closeVal: weekdaysClose, setClose: setWeekdaysClose },
    { label: t("admin.restaurant.saturday"), openVal: saturdayOpen, setOpen: setSaturdayOpen, closeVal: saturdayClose, setClose: setSaturdayClose },
    { label: t("admin.restaurant.sunday"), openVal: sundayOpen, setOpen: setSundayOpen, closeVal: sundayClose, setClose: setSundayClose }
  ];

  return (
    <>
      <AdminPageHeader
        title={t("admin.restaurant.title")}
        description={t("admin.restaurant.description")}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-md border border-line bg-white p-5 shadow-soft"
      >
        {/* Published */}
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-line bg-cream px-4 py-3">
          <span>
            <span className="block text-sm font-black text-ink">
              {t("admin.restaurant.published")}
            </span>
            <span className="block text-xs font-semibold text-ink/50">
              {t("admin.restaurant.publishedHelp")}
            </span>
          </span>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((c) => ({ ...c, isActive: event.target.checked }))
            }
            className="h-5 w-5 accent-leaf"
          />
        </label>

        {/* Basics */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink/50">
            {t("admin.restaurant.stepBasics")}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.name")} *
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((c) => ({ ...c, name: event.target.value }))
                }
                placeholder="Ex: Pizzaria do Alex"
                required
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.slug")} *
              </span>
              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((c) => ({ ...c, slug: event.target.value }))
                }
                placeholder="pizzaria-do-alex"
                required
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.restaurant.descriptionLabel")}
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((c) => ({ ...c, description: event.target.value }))
              }
              placeholder="Ex: As melhores pizzas da cidade, feitas no forno a lenha."
              rows={3}
              className="mt-2 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>
        </div>

        <hr className="border-line" />

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink/50">
            {t("admin.restaurant.stepContact")}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.whatsapp")}
              </span>
              <input
                value={form.whatsapp}
                onChange={(event) =>
                  setForm((c) => ({ ...c, whatsapp: event.target.value }))
                }
                placeholder="+55 11 99999-0000"
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.instagram")}
              </span>
              <input
                value={form.instagram}
                onChange={(event) =>
                  setForm((c) => ({ ...c, instagram: event.target.value }))
                }
                placeholder="@restaurante"
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.restaurant.address")}
            </span>
            <input
              value={form.address}
              onChange={(event) =>
                setForm((c) => ({ ...c, address: event.target.value }))
              }
              placeholder="Ex: Av. Paulista, 1000"
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-[1fr_120px]">
            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.city")}
              </span>
              <input
                value={form.city}
                onChange={(event) =>
                  setForm((c) => ({ ...c, city: event.target.value }))
                }
                placeholder="São Paulo"
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.restaurant.state")}
              </span>
              <input
                value={form.state}
                onChange={(event) =>
                  setForm((c) => ({ ...c, state: event.target.value }))
                }
                placeholder="SP"
                maxLength={2}
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold uppercase text-ink outline-none focus:border-leaf"
              />
            </label>
          </div>
        </div>

        <hr className="border-line" />

        {/* Hours */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink/50">
            {t("admin.restaurant.stepHours")}
          </h3>

          <div className="grid gap-3 md:grid-cols-3">
            {hourRows.map((row) => (
              <div key={row.label} className="rounded-lg border border-line bg-cream p-3">
                <p className="text-xs font-black text-ink">{row.label}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={row.openVal}
                    onChange={(e) => row.setOpen(e.target.value)}
                    aria-label={`${row.label} ${t("admin.restaurant.opens")}`}
                    className="min-h-10 min-w-0 rounded-md border border-line bg-white px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                  <input
                    type="time"
                    value={row.closeVal}
                    onChange={(e) => row.setClose(e.target.value)}
                    aria-label={`${row.label} ${t("admin.restaurant.closes")}`}
                    className="min-h-10 min-w-0 rounded-md border border-line bg-white px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </div>
                <div className="mt-1.5 grid grid-cols-2 gap-2 text-center text-[10px] font-semibold text-ink/40">
                  <span>{t("admin.restaurant.opens")}</span>
                  <span>{t("admin.restaurant.closes")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <Button type="submit" isLoading={isSaving}>
            {isSaving ? t("admin.common.saving") : t("admin.restaurant.save")}
          </Button>
        </div>
      </form>
    </>
  );
}
