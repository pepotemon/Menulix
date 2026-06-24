"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  ImageIcon,
  Paintbrush,
  Plus,
  Store
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { saveAppearance, uploadRestaurantAsset } from "@/lib/admin-firestore";
import { formatCurrencyBRL } from "@/lib/menu-utils";
import type {
  AppearanceFormInput,
  Product,
  RestaurantTemplate,
  RestaurantTheme
} from "@/types/menu";

type ColorKey = keyof RestaurantTheme;

type TemplatePreset = { id: RestaurantTemplate; theme: RestaurantTheme };

const templatePresets: TemplatePreset[] = [
  { id: "pizzaria",    theme: { primaryColor: "#1F8A70", secondaryColor: "#D94E35", backgroundColor: "#FFF7EC", textColor: "#1E2528" } },
  { id: "hamburgueria",theme: { primaryColor: "#25211D", secondaryColor: "#C84C2D", backgroundColor: "#F7EFE3", textColor: "#1E2528" } },
  { id: "acai",        theme: { primaryColor: "#5C2E7E", secondaryColor: "#78A641", backgroundColor: "#F6F0FA", textColor: "#24162E" } },
  { id: "marmitaria",  theme: { primaryColor: "#2F6F4E", secondaryColor: "#E0A23B", backgroundColor: "#FFF8EA", textColor: "#253029" } },
  { id: "cafeteria",   theme: { primaryColor: "#68452D", secondaryColor: "#B88A44", backgroundColor: "#F8F1E8", textColor: "#2D2722" } },
  { id: "sushi",       theme: { primaryColor: "#152C33", secondaryColor: "#D94343", backgroundColor: "#F2F7F7", textColor: "#172226" } },
  { id: "doceria",     theme: { primaryColor: "#A53B72", secondaryColor: "#E7A93C", backgroundColor: "#FFF1F6", textColor: "#35202B" } }
];

function getTemplateLabelKey(id: RestaurantTemplate) {
  return `admin.appearance.template.${id}` as const;
}

const colorLabels: Record<ColorKey, string> = {
  primaryColor: "Cor principal",
  secondaryColor: "Destaque",
  backgroundColor: "Fundo",
  textColor: "Texto"
};

export default function AdminAppearancePage(): JSX.Element {
  const { restaurant, categories, products, isLoading, errorMessage, refresh } = useAdminData();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [form, setForm] = useState<AppearanceFormInput | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [colorPicker, setColorPicker] = useState<{
    key: ColorKey;
    top: number;
    left: number;
  } | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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

  function openColorPicker(key: ColorKey, e: React.MouseEvent<HTMLButtonElement>): void {
    const rect = e.currentTarget.getBoundingClientRect();
    const left = Math.min(rect.left, window.innerWidth - 240);
    setColorPicker({ key, top: rect.bottom + 8, left });
  }

  function updateTheme(key: ColorKey, value: string): void {
    setForm((c) => c ? { ...c, theme: { ...c.theme, [key]: value } } : c);
  }

  function handleTemplateChange(id: RestaurantTemplate): void {
    const preset = templatePresets.find((p) => p.id === id);
    if (!preset) return;
    setForm((c) => c ? { ...c, template: id, theme: preset.theme } : c);
  }

  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>): void {
    setLogoFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  }

  function handleBannerFile(e: React.ChangeEvent<HTMLInputElement>): void {
    setBannerFile(e.target.files?.[0] ?? null);
    e.target.value = "";
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
  const activeCategories = categories.filter((c) => c.isActive);
  const themeVars = {
    "--restaurant-primary": form.theme.primaryColor,
    "--restaurant-secondary": form.theme.secondaryColor,
    "--restaurant-bg": form.theme.backgroundColor,
    "--restaurant-text": form.theme.textColor
  } as CSSProperties;

  const currentPreset = templatePresets.find((p) => p.id === form.template);
  const presetSwatches = currentPreset
    ? Object.values(currentPreset.theme)
    : Object.values(form.theme);

  return (
    <>
      {/* Sticky sub-header */}
      <div className="sticky top-14 z-20 -mx-4 -mt-5 mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line bg-white/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-ink">{t("admin.appearance.title")}</span>
          {/* Inline color swatches */}
          <div className="ml-1 flex items-center gap-1">
            {(Object.keys(colorLabels) as ColorKey[]).map((key) => (
              <button
                key={key}
                type="button"
                title={colorLabels[key]}
                onClick={(e) => openColorPicker(key, e)}
                className="relative h-5 w-5 rounded-full border-2 border-white shadow-md transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
                style={{ backgroundColor: form.theme[key] }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTypeSelector(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-cream px-3 py-1.5 text-xs font-bold text-ink transition hover:border-leaf hover:text-leaf"
          >
            <Store size={13} />
            {t("admin.appearance.template")}
          </button>
          <Button size="sm" onClick={() => void handleSave()} isLoading={isSaving}>
            {isSaving ? t("admin.common.saving") : t("admin.appearance.save")}
          </Button>
        </div>
      </div>

      {/* ── LIVE PREVIEW ── */}
      <div
        className="overflow-hidden rounded-xl border border-line shadow-soft"
        style={{ ...themeVars, backgroundColor: form.theme.backgroundColor }}
      >
        {/* HEADER / BANNER */}
        <div
          className="relative"
          style={{ backgroundColor: form.theme.primaryColor, minHeight: "260px" }}
        >
          {/* Banner image */}
          {previewBannerUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewBannerUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/40 to-ink/10" />

          {/* Edit buttons — top right */}
          <div className="absolute right-3 top-3 z-10 flex gap-1.5">
            <button
              type="button"
              title="Alterar banner"
              onClick={() => bannerInputRef.current?.click()}
              className="edit-overlay-btn"
            >
              <Camera size={14} />
            </button>
            <button
              type="button"
              title={colorLabels.primaryColor}
              onClick={(e) => openColorPicker("primaryColor", e)}
              className="edit-overlay-btn"
            >
              <Paintbrush size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="relative mx-auto flex max-w-4xl flex-col justify-end px-4 pb-6 pt-10 sm:px-6">
            {/* Logo + name row */}
            <div className="flex items-end gap-4">
              {/* Logo with edit overlay */}
              <div className="group relative shrink-0">
                <div className="h-20 w-20 overflow-hidden rounded-xl border-4 border-white bg-white shadow-soft sm:h-24 sm:w-24">
                  {previewLogoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewLogoUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink/30">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  title="Alterar logo"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md text-ink transition hover:text-leaf"
                >
                  <Camera size={13} />
                </button>
              </div>

              <div className="min-w-0 pb-1">
                <span className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-0.5 text-xs font-bold text-white/90 backdrop-blur">
                  {t("public.header.badge")}
                </span>
                <h1 className="mt-1 text-2xl font-black leading-tight text-white sm:text-4xl">
                  {restaurant.name}
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
              {restaurant.description}
            </p>

            <button
              type="button"
              className="mt-4 w-full max-w-xs rounded-lg py-2.5 text-sm font-black text-white sm:w-auto sm:px-8"
              style={{ backgroundColor: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
            >
              {t("public.whatsapp")}
            </button>
          </div>
        </div>

        {/* CATEGORY NAV */}
        {activeCategories.length > 0 && (
          <div
            className="border-b border-black/10 flex gap-2 overflow-x-auto px-4 py-3 sm:px-6"
            style={{ backgroundColor: form.theme.backgroundColor }}
          >
            {activeCategories.map((cat, i) => (
              <span
                key={cat.id}
                className="shrink-0 rounded-full px-4 py-1.5 text-sm font-bold"
                style={
                  i === 0
                    ? { backgroundColor: form.theme.primaryColor, color: "#fff", border: `1px solid ${form.theme.primaryColor}` }
                    : { backgroundColor: "transparent", color: form.theme.textColor, border: `1px solid ${form.theme.primaryColor}40` }
                }
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* PRODUCTS BODY */}
        <div
          className="relative px-4 py-5 sm:px-6"
          style={{ backgroundColor: form.theme.backgroundColor }}
        >
          {/* Background color edit button */}
          <button
            type="button"
            title={colorLabels.backgroundColor}
            onClick={(e) => openColorPicker("backgroundColor", e)}
            className="absolute right-3 top-3 z-10 edit-overlay-btn-sm"
          >
            <Paintbrush size={12} />
          </button>

          {activeCategories.length === 0 && products.length === 0 ? (
            <p className="py-10 text-center text-sm font-semibold opacity-50" style={{ color: form.theme.textColor }}>
              Adicione categorias e produtos para ver a prévia completa.
            </p>
          ) : (
            <div className="space-y-8">
              {activeCategories.map((cat) => {
                const catProducts = products.filter(
                  (p) => p.categoryId === cat.id && p.isAvailable
                );
                if (catProducts.length === 0) return null;

                return (
                  <section key={cat.id}>
                    <div className="mb-3 flex items-end justify-between">
                      <h2 className="text-lg font-black" style={{ color: form.theme.textColor }}>
                        {cat.name}
                      </h2>
                      <span className="text-xs font-semibold opacity-50" style={{ color: form.theme.textColor }}>
                        {catProducts.length}{" "}
                        {catProducts.length === 1 ? t("public.category.item") : t("public.category.items")}
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {catProducts.map((product) => (
                        <PreviewProductCard
                          key={product.id}
                          product={product}
                          theme={form!.theme}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* Secondary color visible via featured badge info */}
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              title={colorLabels.secondaryColor}
              onClick={(e) => openColorPicker("secondaryColor", e)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-80"
              style={{ backgroundColor: form.theme.secondaryColor }}
            >
              <Paintbrush size={11} />
              {colorLabels.secondaryColor}
            </button>
            <button
              type="button"
              title={colorLabels.textColor}
              onClick={(e) => openColorPicker("textColor", e)}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
              style={{ borderColor: form.theme.textColor + "40", color: form.theme.textColor }}
            >
              <Paintbrush size={11} />
              {colorLabels.textColor}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleLogoFile}
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleBannerFile}
      />

      {/* ── COLOR PICKER POPOVER ── */}
      {colorPicker && form && (
        <>
          <div
            className="fixed inset-0 z-[55]"
            onClick={() => setColorPicker(null)}
          />
          <div
            className="fixed z-[56] w-52 rounded-xl border border-line bg-white p-3 shadow-xl"
            style={{ top: colorPicker.top, left: colorPicker.left }}
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-ink/50">
              {colorLabels[colorPicker.key]}
            </p>
            <div className="flex items-center gap-2 rounded-md border border-line bg-cream px-2 py-1.5">
              <input
                type="color"
                value={form.theme[colorPicker.key]}
                onChange={(e) => updateTheme(colorPicker.key, e.target.value)}
                className="h-7 w-9 cursor-pointer rounded border border-line bg-white"
              />
              <input
                type="text"
                value={form.theme[colorPicker.key]}
                onChange={(e) => {
                  if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                    updateTheme(colorPicker.key, e.target.value);
                  }
                }}
                className="w-full bg-transparent font-mono text-xs text-ink outline-none"
                maxLength={7}
              />
            </div>
            <div className="mt-2.5">
              <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wide text-ink/40">
                Sugestões
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presetSwatches.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    onClick={() => updateTheme(colorPicker.key, color)}
                    className="h-6 w-6 rounded-full border-2 border-white shadow-sm transition hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── TIPO DE COMÉRCIO MODAL ── */}
      <Modal
        isOpen={showTypeSelector}
        title={t("admin.appearance.template")}
        closeLabel={t("admin.common.close")}
        onClose={() => setShowTypeSelector(false)}
        maxWidthClassName="max-w-sm"
      >
        <div className="grid grid-cols-2 gap-2 px-5 py-4">
          {templatePresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                handleTemplateChange(preset.id);
                setShowTypeSelector(false);
              }}
              className={`relative rounded-xl border p-3 text-left transition hover:border-leaf ${
                form.template === preset.id
                  ? "border-leaf bg-leaf/5"
                  : "border-line bg-cream"
              }`}
            >
              {form.template === preset.id && (
                <Check
                  size={14}
                  className="absolute right-2 top-2 text-leaf"
                />
              )}
              <div className="mb-2 flex gap-1.5">
                {Object.values(preset.theme).map((color) => (
                  <span
                    key={color}
                    className="h-5 w-5 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-black text-ink">
                {t(getTemplateLabelKey(preset.id))}
              </p>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

/* ── Preview product card (no cart needed) ── */
function PreviewProductCard({
  product,
  theme
}: {
  product: Product;
  theme: RestaurantTheme;
}): JSX.Element {
  return (
    <article className="grid grid-cols-[80px_1fr] gap-3 rounded-lg border border-line bg-white p-3 shadow-sm sm:grid-cols-[96px_1fr]">
      <div className="relative aspect-square overflow-hidden rounded-md bg-cream">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink/30">
            <span className="text-xl font-black">
              {product.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {product.isFeatured && (
          <div
            className="absolute left-1.5 top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
            style={{ backgroundColor: theme.secondaryColor }}
          >
            ★
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-2">
        <div>
          <p className="text-sm font-bold leading-tight" style={{ color: theme.textColor }}>
            {product.name}
          </p>
          {product.description && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-ink/60">
              {product.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <strong className="text-sm font-black" style={{ color: theme.textColor }}>
            {formatCurrencyBRL(product.price)}
          </strong>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:opacity-80"
            style={{ backgroundColor: theme.primaryColor }}
            aria-label="Adicionar"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}
