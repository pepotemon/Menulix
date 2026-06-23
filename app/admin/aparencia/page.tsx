"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Check, Palette, Smartphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/components/ui/toast";
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
  { id: "pizzaria", theme: { primaryColor: "#1F8A70", secondaryColor: "#D94E35", backgroundColor: "#FFF7EC", textColor: "#1E2528" } },
  { id: "hamburgueria", theme: { primaryColor: "#25211D", secondaryColor: "#C84C2D", backgroundColor: "#F7EFE3", textColor: "#1E2528" } },
  { id: "acai", theme: { primaryColor: "#5C2E7E", secondaryColor: "#78A641", backgroundColor: "#F6F0FA", textColor: "#24162E" } },
  { id: "marmitaria", theme: { primaryColor: "#2F6F4E", secondaryColor: "#E0A23B", backgroundColor: "#FFF8EA", textColor: "#253029" } },
  { id: "cafeteria", theme: { primaryColor: "#68452D", secondaryColor: "#B88A44", backgroundColor: "#F8F1E8", textColor: "#2D2722" } },
  { id: "sushi", theme: { primaryColor: "#152C33", secondaryColor: "#D94343", backgroundColor: "#F2F7F7", textColor: "#172226" } },
  { id: "doceria", theme: { primaryColor: "#A53B72", secondaryColor: "#E7A93C", backgroundColor: "#FFF1F6", textColor: "#35202B" } }
];

function getTemplateLabelKey(template: RestaurantTemplate) {
  return `admin.appearance.template.${template}` as const;
}

export default function AdminAppearancePage(): JSX.Element {
  const { restaurant, isLoading, errorMessage, refresh } = useAdminData();
  const { t } = useI18n();
  const { showToast } = useToast();
  const [form, setForm] = useState<AppearanceFormInput | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
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
    if (!logoFile) { setLogoPreviewUrl(""); return; }
    const url = URL.createObjectURL(logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  useEffect(() => {
    if (!bannerFile) { setBannerPreviewUrl(""); return; }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  function handleTemplateChange(template: RestaurantTemplate): void {
    const preset = templatePresets.find((item) => item.id === template);
    if (!preset) return;
    setForm((c) => c ? { ...c, template, theme: preset.theme } : c);
  }

  function updateTheme(key: keyof RestaurantTheme, value: string): void {
    setForm((c) => c ? { ...c, theme: { ...c.theme, [key]: value } } : c);
  }

  async function handleSave(): Promise<void> {
    if (!restaurant || !form) return;
    setIsSaving(true);

    try {
      let logoUrl = form.logoUrl;
      let bannerUrl = form.bannerUrl;

      if (logoFile) logoUrl = await uploadRestaurantAsset(restaurant.id, "logo", logoFile);
      if (bannerFile) bannerUrl = await uploadRestaurantAsset(restaurant.id, "banner", bannerFile);

      await saveAppearance(restaurant.id, { ...form, logoUrl, bannerUrl });
      setForm((c) => c ? { ...c, logoUrl, bannerUrl } : c);
      await refresh();
      setLogoFile(null);
      setBannerFile(null);
      showToast(t("admin.appearance.saved"), "success");
    } catch {
      showToast(t("admin.appearance.saveError"), "error");
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

  const preview = (
    <div
      className="overflow-hidden rounded-xl border border-line shadow-soft"
      style={{ backgroundColor: form.theme.backgroundColor, color: form.theme.textColor }}
    >
      <div className="relative h-40" style={{ backgroundColor: form.theme.primaryColor }}>
        {previewBannerUrl ? (
          <Image alt="" src={previewBannerUrl} fill sizes="380px" className="object-cover" unoptimized />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
            {t("public.header.badge")}
          </span>
        </div>
      </div>
      <div className="relative px-4 pb-4 pt-0">
        <div className="-mt-10 mb-3 h-20 w-20 overflow-hidden rounded-xl border-4 border-white bg-white shadow-soft">
          {previewLogoUrl ? (
            <Image alt="" src={previewLogoUrl} width={80} height={80} className="h-full w-full object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ color: form.theme.primaryColor }}>
              <Palette aria-hidden="true" size={24} />
            </div>
          )}
        </div>
        <p className="text-xl font-black leading-tight">{restaurant.name}</p>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 opacity-70">{restaurant.description}</p>
        <div className="mt-3 grid gap-1.5">
          <button
            type="button"
            className="w-full rounded-md py-2 text-xs font-black text-white"
            style={{ backgroundColor: form.theme.primaryColor }}
          >
            {t("public.whatsapp")}
          </button>
          <div className="grid grid-cols-3 gap-1.5">
            <span className="h-1.5 rounded-full" style={{ backgroundColor: form.theme.primaryColor }} />
            <span className="h-1.5 rounded-full" style={{ backgroundColor: form.theme.secondaryColor }} />
            <span className="h-1.5 rounded-full bg-white/50" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title={t("admin.appearance.title")}
        description={t("admin.appearance.description")}
      />

      {/* Mobile preview — shown above controls */}
      <div className="mb-5 xl:hidden">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone size={16} className="text-leaf" />
          <span className="text-sm font-black text-ink">{t("admin.appearance.preview")}</span>
        </div>
        {preview}
      </div>

      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-5 xl:items-start">
        {/* Controls */}
        <section className="space-y-6 rounded-md border border-line bg-white p-5 shadow-soft">

          {/* Template */}
          <div>
            <h3 className="text-sm font-black text-ink">{t("admin.appearance.template")}</h3>
            <p className="mt-1 text-xs leading-5 text-ink/55">{t("admin.appearance.templateHelp")}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
              {templatePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleTemplateChange(preset.id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    form.template === preset.id
                      ? "border-leaf bg-leaf/5"
                      : "border-line bg-cream hover:border-leaf"
                  }`}
                >
                  <span className="flex items-center justify-between gap-1 text-xs font-black text-ink">
                    {t(getTemplateLabelKey(preset.id))}
                    {form.template === preset.id ? (
                      <Check aria-hidden="true" className="h-3.5 w-3.5 text-leaf" />
                    ) : null}
                  </span>
                  <span className="mt-2 flex gap-1.5">
                    {Object.values(preset.theme).map((color) => (
                      <span
                        key={color}
                        className="h-4 w-4 rounded-full border border-line"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-line" />

          {/* Colors */}
          <div>
            <h3 className="text-sm font-black text-ink">{t("admin.appearance.colors")}</h3>
            <p className="mt-1 text-xs leading-5 text-ink/55">{t("admin.appearance.colorsHelp")}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["primaryColor", t("admin.appearance.primaryColor")],
                  ["secondaryColor", t("admin.appearance.secondaryColor")],
                  ["backgroundColor", t("admin.appearance.backgroundColor")],
                  ["textColor", t("admin.appearance.textColor")]
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-xs font-bold text-ink">{label}</span>
                  <span className="mt-1.5 flex min-h-11 items-center gap-2.5 rounded-md border border-line bg-cream px-3">
                    <input
                      type="color"
                      value={form.theme[key]}
                      onChange={(event) => updateTheme(key, event.target.value)}
                      className="h-7 w-8 cursor-pointer rounded border border-line bg-white"
                    />
                    <input
                      value={form.theme[key]}
                      onChange={(event) => updateTheme(key, event.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-ink outline-none"
                    />
                  </span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-line" />

          {/* Images */}
          <div>
            <h3 className="text-sm font-black text-ink">{t("admin.appearance.logo")} & {t("admin.appearance.banner")}</h3>
            <p className="mt-1 text-xs leading-5 text-ink/55">{t("admin.appearance.imagesHelp")}</p>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              {(
                [
                  { kind: "logo" as const, title: t("admin.appearance.logo"), urlLabel: t("admin.appearance.logoUrl"), value: form.logoUrl, file: logoFile, setFile: setLogoFile },
                  { kind: "banner" as const, title: t("admin.appearance.banner"), urlLabel: t("admin.appearance.bannerUrl"), value: form.bannerUrl, file: bannerFile, setFile: setBannerFile }
                ]
              ).map((item) => (
                <div key={item.kind} className="space-y-3">
                  <ImageUpload
                    label={item.title}
                    chooseLabel={t("admin.image.choose")}
                    removeLabel={t("admin.image.remove")}
                    emptyLabel={item.kind === "logo" ? t("admin.image.emptyLogo") : t("admin.image.emptyBanner")}
                    file={item.file}
                    currentUrl={item.value}
                    aspect={item.kind === "logo" ? "square" : "wide"}
                    onFileChange={item.setFile}
                    onRemove={() =>
                      setForm((c) => c ? { ...c, [`${item.kind}Url`]: "" } : c)
                    }
                  />
                  <label className="block">
                    <span className="text-xs font-bold text-ink">{item.urlLabel}</span>
                    <input
                      value={item.value}
                      onChange={(event) =>
                        setForm((c) => c ? { ...c, [`${item.kind}Url`]: event.target.value } : c)
                      }
                      className="mt-1.5 min-h-10 w-full rounded-md border border-line bg-white px-3 text-xs font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="border-t border-line pt-4">
            <Button
              type="button"
              onClick={() => void handleSave()}
              isLoading={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? t("admin.common.saving") : t("admin.appearance.save")}
            </Button>
          </div>
        </section>

        {/* Desktop preview */}
        <aside className="hidden xl:block xl:sticky xl:top-14 xl:self-start">
          <div className="rounded-md border border-line bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone size={16} className="text-leaf" />
              <h2 className="text-sm font-black text-ink">{t("admin.appearance.preview")}</h2>
            </div>
            {preview}
          </div>
        </aside>
      </div>
    </>
  );
}
