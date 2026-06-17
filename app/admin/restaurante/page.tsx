"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
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
  const [form, setForm] = useState<RestaurantFormInput>(emptyForm);
  const [weekdaysOpen, setWeekdaysOpen] = useState("");
  const [weekdaysClose, setWeekdaysClose] = useState("");
  const [saturdayOpen, setSaturdayOpen] = useState("");
  const [saturdayClose, setSaturdayClose] = useState("");
  const [sundayOpen, setSundayOpen] = useState("");
  const [sundayClose, setSundayClose] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
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
      setStatusMessage("Informações salvas com sucesso.");
    } catch {
      setStatusMessage("Não foi possível salvar. Confira os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title="Informações"
        description={errorMessage || "Carregando dados do restaurante."}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Informações"
        description="Mantenha os dados principais do seu cardápio sempre atualizados."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-md border border-line bg-white p-5 shadow-soft"
      >
        <label className="flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
          <span>
            <span className="block text-sm font-black text-ink">
              Cardápio publicado
            </span>
            <span className="block text-xs font-semibold text-ink/50">
              Desative se ainda estiver preparando o menu.
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
            <span className="text-sm font-bold text-ink">Nome do restaurante</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Link curto</span>
            <input
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({ ...current, slug: event.target.value }))
              }
              required
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-ink">Descrição</span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value
              }))
            }
            rows={3}
            className="mt-2 w-full rounded-md border border-line bg-cream px-3 py-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-ink">WhatsApp</span>
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
            <span className="text-sm font-bold text-ink">Instagram</span>
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

        <div className="grid gap-4 md:grid-cols-3">
          <label className="block md:col-span-3">
            <span className="text-sm font-bold text-ink">Endereço</span>
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

          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-ink">Cidade</span>
            <input
              value={form.city}
              onChange={(event) =>
                setForm((current) => ({ ...current, city: event.target.value }))
              }
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">Estado</span>
            <input
              value={form.state}
              onChange={(event) =>
                setForm((current) => ({ ...current, state: event.target.value }))
              }
              maxLength={2}
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold uppercase text-ink outline-none focus:border-leaf"
            />
          </label>
        </div>

        <section className="rounded-md border border-line bg-cream p-4">
          <h2 className="text-base font-black text-ink">Horários</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["Segunda a sexta", weekdaysOpen, setWeekdaysOpen, weekdaysClose, setWeekdaysClose],
              ["Sábado", saturdayOpen, setSaturdayOpen, saturdayClose, setSaturdayClose],
              ["Domingo", sundayOpen, setSundayOpen, sundayClose, setSundayClose]
            ].map(([label, openValue, setOpen, closeValue, setClose]) => (
              <div key={label as string} className="rounded-md border border-line bg-white p-3">
                <p className="text-sm font-black text-ink">{label as string}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={openValue as string}
                    onChange={(event) =>
                      (setOpen as (value: string) => void)(event.target.value)
                    }
                    className="min-h-11 rounded-md border border-line bg-cream px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                  <input
                    type="time"
                    value={closeValue as string}
                    onChange={(event) =>
                      (setClose as (value: string) => void)(event.target.value)
                    }
                    className="min-h-11 rounded-md border border-line bg-cream px-2 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {statusMessage ? (
          <p className="rounded-md border border-line bg-cream px-3 py-2 text-sm font-bold text-ink/68">
            {statusMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="min-h-12 rounded-md bg-leaf px-4 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar informações"}
        </button>
      </form>
    </>
  );
}
