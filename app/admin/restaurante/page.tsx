"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, MapPin, Store } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
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
  const [form, setForm] = useState<RestaurantFormInput>(emptyForm);
  const [weekdaysOpen, setWeekdaysOpen] = useState("");
  const [weekdaysClose, setWeekdaysClose] = useState("");
  const [saturdayOpen, setSaturdayOpen] = useState("");
  const [saturdayClose, setSaturdayClose] = useState("");
  const [sundayOpen, setSundayOpen] = useState("");
  const [sundayClose, setSundayClose] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formStep, setFormStep] = useState(0);

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
    setStatusMessage("");

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
      setStatusMessage(t("admin.restaurant.saved"));
    } catch {
      setStatusMessage(t("admin.restaurant.saveError"));
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

  return (
    <>
      <AdminPageHeader
        title={t("admin.restaurant.title")}
        description={t("admin.restaurant.description")}
      />

      {statusMessage ? (
        <Feedback
          className="mb-5"
          message={statusMessage}
          tone={
            statusMessage === t("admin.restaurant.saveError") ? "error" : "success"
          }
        />
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-md border border-line bg-white shadow-soft"
      >
        <div className="border-b border-line px-5 py-4">
          <p className="text-xs font-black uppercase text-leaf">
            {t("admin.restaurant.stepLabel")} {formStep + 1}/3
          </p>
          <h2 className="mt-1 text-lg font-black text-ink">
            {[
              t("admin.restaurant.stepBasics"),
              t("admin.restaurant.stepContact"),
              t("admin.restaurant.stepHours")
            ][formStep]}
          </h2>
        </div>

        <div className="grid grid-cols-3 border-b border-line">
          {[
            { label: t("admin.restaurant.stepBasics"), icon: Store },
            { label: t("admin.restaurant.stepContact"), icon: MapPin },
            { label: t("admin.restaurant.stepHours"), icon: Clock3 }
          ].map((step, index) => {
            const Icon = step.icon;

            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setFormStep(index)}
                className={`flex min-h-14 items-center justify-center gap-2 border-r border-line px-2 text-xs font-black transition last:border-r-0 ${
                  formStep === index
                    ? "bg-leaf text-white"
                    : "bg-cream text-ink/60 hover:text-ink"
                }`}
              >
                <Icon aria-hidden="true" size={16} />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {formStep === 0 ? (
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
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
                    setForm((current) => ({
                      ...current,
                      isActive: event.target.checked
                    }))
                  }
                  className="h-5 w-5 accent-leaf"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-ink">
                    {t("admin.restaurant.name")}
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value
                      }))
                    }
                    required
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-ink">
                    {t("admin.restaurant.slug")}
                  </span>
                  <input
                    value={form.slug}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        slug: event.target.value
                      }))
                    }
                    required
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
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
                    setForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-md border border-line bg-cream px-3 py-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                />
              </label>
            </div>
          ) : null}

          {formStep === 1 ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-ink">
                    {t("admin.restaurant.whatsapp")}
                  </span>
                  <input
                    value={form.whatsapp}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        whatsapp: event.target.value
                      }))
                    }
                    placeholder="+55 11 99999-0000"
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-ink">
                    {t("admin.restaurant.instagram")}
                  </span>
                  <input
                    value={form.instagram}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        instagram: event.target.value
                      }))
                    }
                    placeholder="@restaurante"
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
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
                    setForm((current) => ({
                      ...current,
                      address: event.target.value
                    }))
                  }
                  className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
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
                      setForm((current) => ({
                        ...current,
                        city: event.target.value
                      }))
                    }
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-ink">
                    {t("admin.restaurant.state")}
                  </span>
                  <input
                    value={form.state}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        state: event.target.value
                      }))
                    }
                    maxLength={2}
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold uppercase text-ink outline-none focus:border-leaf"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {formStep === 2 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                [t("admin.restaurant.weekdays"), weekdaysOpen, setWeekdaysOpen, weekdaysClose, setWeekdaysClose],
                [t("admin.restaurant.saturday"), saturdayOpen, setSaturdayOpen, saturdayClose, setSaturdayClose],
                [t("admin.restaurant.sunday"), sundayOpen, setSundayOpen, sundayClose, setSundayClose]
              ].map(([label, openValue, setOpen, closeValue, setClose]) => (
                <div key={label as string} className="rounded-md border border-line bg-cream p-4">
                  <p className="text-sm font-black text-ink">{label as string}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={openValue as string}
                      onChange={(event) =>
                        (setOpen as (value: string) => void)(event.target.value)
                      }
                      aria-label={`${label as string} ${t("admin.restaurant.opens")}`}
                      className="min-h-11 min-w-0 rounded-md border border-line bg-white px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                    <input
                      type="time"
                      value={closeValue as string}
                      onChange={(event) =>
                        (setClose as (value: string) => void)(event.target.value)
                      }
                      aria-label={`${label as string} ${t("admin.restaurant.closes")}`}
                      className="min-h-11 min-w-0 rounded-md border border-line bg-white px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs font-semibold text-ink/50">
                    <span>{t("admin.restaurant.opens")}</span>
                    <span>{t("admin.restaurant.closes")}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            disabled={formStep === 0}
            onClick={() => setFormStep((step) => Math.max(0, step - 1))}
          >
            <ArrowLeft aria-hidden="true" size={17} />
            {t("admin.common.back")}
          </Button>

          {formStep < 2 ? (
            <Button
              type="button"
              disabled={formStep === 0 && !form.name.trim()}
              onClick={() => setFormStep((step) => Math.min(2, step + 1))}
            >
              {t("admin.common.next")}
              <ArrowRight aria-hidden="true" size={17} />
            </Button>
          ) : (
            <Button type="submit" isLoading={isSaving}>
              {isSaving ? t("admin.common.saving") : t("admin.restaurant.save")}
            </Button>
          )}
        </div>
      </form>
    </>
  );
}
