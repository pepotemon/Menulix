"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { ImagePlus, Palette, Smartphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import {
  saveAppearance,
  uploadRestaurantAsset
} from "@/lib/admin-firestore";
import type {
  AppearanceFormInput,
  RestaurantTemplate,
  RestaurantTheme
} from "@/types/menu";

type TemplatePreset = {
  id: RestaurantTemplate;
  theme: RestaurantTheme;
};

const templatePresets: TemplatePreset[] = [
  {
    id: "pizzaria",
    theme: {
      primaryColor: "#1F8A70",
      secondaryColor: "#D94E35",
      backgroundColor: "#FFF7EC",
      textColor: "#1E2528"
    }
  },
  {
    id: "hamburgueria",
    theme: {
      primaryColor: "#25211D",
      secondaryColor: "#C84C2D",
      backgroundColor: "#F7EFE3",
      textColor: "#1E2528"
    }
  },
  {
    id: "acai",
    theme: {
      primaryColor: "#5C2E7E",
      secondaryColor: "#78A641",
      backgroundColor: "#F6F0FA",
      textColor: "#24162E"
    }
  },
  {
    id: "marmitaria",
    theme: {
      primaryColor: "#2F6F4E",
      secondaryColor: "#E0A23B",
      backgroundColor: "#FFF8EA",
      textColor: "#253029"
    }
  },
  {
    id: "cafeteria",
    theme: {
      primaryColor: "#68452D",
      secondaryColor: "#B88A44",
      backgroundColor: "#F8F1E8",
      textColor: "#2D2722"
    }
  },
  {
    id: "sushi",
    theme: {
      primaryColor: "#152C33",
      secondaryColor: "#D94343",
      backgroundColor: "#F2F7F7",
      textColor: "#172226"
    }
  },
  {
    id: "doceria",
    theme: {
      primaryColor: "#A53B72",
      secondaryColor: "#E7A93C",
      backgroundColor: "#FFF1F6",
      textColor: "#35202B"
    }
  }
];

function getTemplateLabelKey(template: RestaurantTemplate) {
  return `admin.appearance.template.${template}` as const;
}

export default function AdminAppearancePage(): JSX.Element {
  const { restaurant, isLoading, errorMessage, refresh } = useAdminData();
  const { t } = useI18n();
  const [form, setForm] = useState<AppearanceFormInput | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");

  useEffect(() => {
    if (!restaurant) return;

    setForm({
      template: restaurant.template ?? "pizzaria",
      logoUrl: restaurant.logoUrl,
      bannerUrl: restaurant.bannerUrl,
      theme: restaurant.theme
    });
  }, [restaurant]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [bannerFile]);

  function handleTemplateChange(template: RestaurantTemplate): void {
    const preset = templatePresets.find((item) => item.id === template);
    if (!preset) return;

    setForm((current) =>
      current
        ? {
            ...current,
            template,
            theme: preset.theme
          }
        : current
    );
  }

  function updateTheme(key: keyof RestaurantTheme, value: string): void {
    setForm((current) =>
      current
        ? {
            ...current,
            theme: {
              ...current.theme,
              [key]: value
            }
          }
        : current
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!restaurant || !form) return;

    setIsSaving(true);
    setStatusMessage("");

    try {
      let logoUrl = form.logoUrl;
      let bannerUrl = form.bannerUrl;

      if (logoFile) {
        logoUrl = await uploadRestaurantAsset(restaurant.id, "logo", logoFile);
      }

      if (bannerFile) {
        bannerUrl = await uploadRestaurantAsset(restaurant.id, "banner", bannerFile);
      }

      await saveAppearance(restaurant.id, {
        ...form,
        logoUrl,
        bannerUrl
      });
      setForm((current) =>
        current
          ? {
              ...current,
              logoUrl,
              bannerUrl
            }
          : current
      );
      await refresh();
      setLogoFile(null);
      setBannerFile(null);
      setStatusMessage(t("admin.appearance.saved"));
    } catch {
      setStatusMessage(t("admin.appearance.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !restaurant || !form) {
    return (
      <AdminPageHeader
        title={t("admin.appearance.title")}
        description={errorMessage || t("admin.appearance.loading")}
      />
    );
  }

  const previewLogoUrl = logoPreviewUrl || form.logoUrl;
  const previewBannerUrl = bannerPreviewUrl || form.bannerUrl;

  return (
    <>
      <AdminPageHeader
        title={t("admin.appearance.title")}
        description={t("admin.appearance.description")}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"
      >
        <section className="space-y-5">
          <div className="rounded-md border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-black text-ink">
              {t("admin.appearance.template")}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {templatePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleTemplateChange(preset.id)}
                  className={`rounded-md border p-3 text-left transition ${
                    form.template === preset.id
                      ? "border-leaf bg-cream"
                      : "border-line bg-white hover:border-leaf"
                  }`}
                >
                  <span className="block text-sm font-black text-ink">
                    {t(getTemplateLabelKey(preset.id))}
                  </span>
                  <span className="mt-3 flex gap-2">
                    {Object.values(preset.theme).map((color) => (
                      <span
                        key={color}
                        className="h-6 w-6 rounded-full border border-line"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-line bg-white p-5 shadow-soft">
            <h2 className="text-lg font-black text-ink">
              {t("admin.appearance.colors")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                ["primaryColor", t("admin.appearance.primaryColor")],
                ["secondaryColor", t("admin.appearance.secondaryColor")],
                ["backgroundColor", t("admin.appearance.backgroundColor")],
                ["textColor", t("admin.appearance.textColor")]
              ].map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-sm font-bold text-ink">{label}</span>
                  <span className="mt-2 flex min-h-12 items-center gap-3 rounded-md border border-line bg-cream px-3">
                    <input
                      type="color"
                      value={form.theme[key as keyof RestaurantTheme]}
                      onChange={(event) =>
                        updateTheme(
                          key as keyof RestaurantTheme,
                          event.target.value
                        )
                      }
                      className="h-8 w-10 rounded border border-line bg-white"
                    />
                    <input
                      value={form.theme[key as keyof RestaurantTheme]}
                      onChange={(event) =>
                        updateTheme(
                          key as keyof RestaurantTheme,
                          event.target.value
                        )
                      }
                      className="w-full bg-transparent text-sm font-semibold text-ink outline-none"
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                kind: "logo" as const,
                title: t("admin.appearance.logo"),
                urlLabel: t("admin.appearance.logoUrl"),
                value: form.logoUrl,
                file: logoFile,
                setFile: setLogoFile
              },
              {
                kind: "banner" as const,
                title: t("admin.appearance.banner"),
                urlLabel: t("admin.appearance.bannerUrl"),
                value: form.bannerUrl,
                file: bannerFile,
                setFile: setBannerFile
              }
            ].map((item) => (
              <section
                key={item.kind}
                className="rounded-md border border-line bg-white p-5 shadow-soft"
              >
                <h2 className="text-lg font-black text-ink">{item.title}</h2>
                <p className="mt-1 text-sm font-semibold text-ink/50">
                  {t("admin.appearance.uploadHelp")}
                </p>
                <label className="mt-4 flex min-h-12 items-center gap-2 rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink">
                  <ImagePlus size={18} className="text-ink/50" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      item.setFile(event.target.files?.[0] ?? null)
                    }
                    className="w-full text-sm"
                  />
                </label>
                <label className="mt-4 block">
                  <span className="text-sm font-bold text-ink">{item.urlLabel}</span>
                  <input
                    value={item.value}
                    onChange={(event) =>
                      setForm((current) =>
                        current
                          ? {
                              ...current,
                              [`${item.kind}Url`]: event.target.value
                            }
                          : current
                      )
                    }
                    className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                  />
                </label>
                {item.file ? (
                  <p className="mt-2 text-xs font-bold text-leaf">
                    {item.file.name}
                  </p>
                ) : null}
              </section>
            ))}
          </div>
        </section>

        <aside className="rounded-md border border-line bg-white p-5 shadow-soft xl:sticky xl:top-6 xl:self-start">
          <div className="mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-leaf" />
            <h2 className="text-lg font-black text-ink">
              {t("admin.appearance.preview")}
            </h2>
          </div>
          <div
            className="overflow-hidden rounded-lg border border-line shadow-soft"
            style={{
              backgroundColor: form.theme.backgroundColor,
              color: form.theme.textColor
            }}
          >
            <div
              className="relative h-44"
              style={{ backgroundColor: form.theme.primaryColor }}
            >
              {previewBannerUrl ? (
                <Image
                  alt=""
                  src={previewBannerUrl}
                  fill
                  sizes="360px"
                  className="object-cover"
                  unoptimized
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/35 to-ink/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-flex rounded-full bg-white/18 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                  {t("public.header.badge")}
                </span>
              </div>
            </div>
            <div className="relative px-4 pb-5 pt-0">
              <div className="-mt-12 mb-4 h-24 w-24 overflow-hidden rounded-lg border-4 border-white bg-white shadow-soft">
                {previewLogoUrl ? (
                  <Image
                    alt=""
                    src={previewLogoUrl}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ color: form.theme.primaryColor }}
                  >
                    <Palette aria-hidden="true" size={28} />
                  </div>
                )}
              </div>
              <p className="text-2xl font-black leading-tight">{restaurant.name}</p>
              <p className="mt-2 line-clamp-3 text-sm leading-6 opacity-75">
                {restaurant.description}
              </p>
              <button
                type="button"
                className="mt-4 min-h-11 w-full rounded-md px-4 py-2 text-sm font-black text-white"
                style={{ backgroundColor: form.theme.primaryColor }}
              >
                {t("public.whatsapp")}
              </button>
            </div>
          </div>

          {statusMessage ? (
            <p className="mt-4 rounded-md border border-line bg-cream px-3 py-2 text-sm font-bold text-ink/68">
              {statusMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-5 min-h-12 w-full rounded-md bg-leaf px-4 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? t("admin.common.saving") : t("admin.appearance.save")}
          </button>
        </aside>
      </form>
    </>
  );
}
