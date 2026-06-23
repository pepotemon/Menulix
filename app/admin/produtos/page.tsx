"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  ImageIcon,
  Pencil,
  Plus,
  Star,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { ImageUpload } from "@/components/ui/image-upload";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductImage
} from "@/lib/admin-firestore";
import { formatCurrencyBRL } from "@/lib/menu-utils";
import type { Product, ProductFormInput } from "@/types/menu";

const emptyForm: ProductFormInput = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  imageUrl: "",
  isAvailable: true,
  isFeatured: false,
  order: 1
};

export default function AdminProductsPage(): JSX.Element {
  const {
    restaurant,
    categories,
    products,
    isLoading,
    errorMessage,
    refresh
  } = useAdminData();
  const { t } = useI18n();
  const { showToast } = useToast();

  const [form, setForm] = useState<ProductFormInput>(emptyForm);
  const [priceInput, setPriceInput] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  useEffect(() => {
    if (!isFormOpen || editingProduct) return;
    setForm((current) => ({
      ...current,
      categoryId: current.categoryId || categories[0]?.id || "",
      order: current.order || products.length + 1
    }));
  }, [categories, editingProduct, isFormOpen, products.length]);

  function openCreateForm(): void {
    setEditingProduct(null);
    setForm({
      ...emptyForm,
      categoryId: categories[0]?.id ?? "",
      order: products.length + 1
    });
    setPriceInput("");
    setOrderInput("");
    setImageFile(null);
    setSaveError("");
    setIsFormOpen(true);
  }

  function openEditForm(product: Product): void {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      isFeatured: product.isFeatured,
      order: product.order
    });
    setPriceInput(String(product.price));
    setOrderInput(String(product.order));
    setImageFile(null);
    setSaveError("");
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setSaveError("");
  }

  async function handleSave(): Promise<void> {
    if (!restaurant) return;

    setIsSaving(true);
    setSaveError("");

    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        imageUrl = await uploadProductImage(restaurant.id, imageFile);
      }

      const parsedPrice = Number(priceInput);
      const parsedOrder = Number(orderInput);
      const input: ProductFormInput = {
        ...form,
        imageUrl,
        price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
        order:
          Number.isFinite(parsedOrder) && parsedOrder > 0
            ? parsedOrder
            : products.length + 1
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, input);
        showToast(t("admin.products.updated"), "success");
      } else {
        await createProduct(restaurant.id, input);
        showToast(t("admin.products.created"), "success");
      }

      closeForm();
      await refresh();
    } catch {
      setSaveError(t("admin.products.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(product: Product): Promise<void> {
    await updateProduct(product.id, {
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl,
      isAvailable: !product.isAvailable,
      isFeatured: product.isFeatured,
      order: product.order
    });
    await refresh();
  }

  async function handleDelete(product: Product): Promise<void> {
    const confirmed = window.confirm(
      `${t("admin.products.deleteConfirm")} "${product.name}"?`
    );
    if (!confirmed) return;

    await deleteProduct(product.id);
    showToast(t("admin.products.updated"), "info");
    await refresh();
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title={t("admin.products.title")}
        description={errorMessage || t("admin.products.loading")}
      />
    );
  }

  const productGroups =
    activeCategoryId === "all"
      ? categories
          .map((cat) => ({
            category: cat,
            items: products.filter((p) => p.categoryId === cat.id)
          }))
          .filter((g) => g.items.length > 0)
      : [
          {
            category: categories.find((c) => c.id === activeCategoryId) ?? null,
            items: products.filter((p) => p.categoryId === activeCategoryId)
          }
        ];

  return (
    <>
      <AdminPageHeader
        title={t("admin.products.title")}
        description={t("admin.products.description")}
      />

      {categories.length === 0 ? (
        <Feedback className="mb-4" message={t("admin.products.needCategory")} />
      ) : null}

      {/* Category filter tabs */}
      {categories.length > 0 && (
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategoryId("all")}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold transition ${
              activeCategoryId === "all"
                ? "border-leaf bg-leaf text-white"
                : "border-line bg-white text-ink/60 hover:text-ink"
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold transition ${
                  activeCategoryId === cat.id
                    ? "border-leaf bg-leaf text-white"
                    : "border-line bg-white text-ink/60 hover:text-ink"
                }`}
              >
                {cat.name}
                {!cat.isActive && (
                  <EyeOff size={10} aria-label="Oculta" />
                )}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Product list */}
      <div className="rounded-md border border-line bg-white shadow-soft">
        {products.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm font-semibold text-ink/50">
            {t("admin.products.empty")}
          </p>
        ) : null}

        {productGroups.length === 0 && products.length > 0 ? (
          <p className="px-5 py-8 text-center text-sm font-semibold text-ink/50">
            Nenhum produto nesta categoria.
          </p>
        ) : null}

        <div className="divide-y divide-line">
          {productGroups.map((group) => (
            <div key={group.category?.id ?? "uncategorized"}>
              {activeCategoryId === "all" && (
                <div className="flex items-center gap-2 bg-cream px-5 py-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-ink/50">
                    {group.category?.name ?? t("admin.products.noCategory")}
                  </span>
                  {group.category && !group.category.isActive && (
                    <EyeOff
                      size={11}
                      className="text-ink/35"
                      aria-label="Categoria oculta"
                    />
                  )}
                </div>
              )}

              {group.items.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-3">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt=""
                        width={56}
                        height={56}
                        unoptimized
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-cream text-ink/30">
                        <ImageIcon aria-hidden="true" size={16} />
                        <span className="mt-0.5 text-xs font-black">
                          {product.name.trim().charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-ink">{product.name}</p>
                      <p className="mt-0.5 text-sm font-bold text-leaf">
                        {formatCurrencyBRL(product.price)}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-ink/40">
                        {product.isAvailable
                          ? t("admin.common.available")
                          : t("admin.common.unavailable")}
                        {product.isFeatured && " · ⭐"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditForm(product)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink transition hover:border-leaf hover:text-leaf"
                      aria-label={t("admin.common.edit")}
                      title={t("admin.common.edit")}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(product)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink transition hover:border-leaf hover:text-leaf"
                      title={
                        product.isAvailable
                          ? t("admin.common.hide")
                          : t("admin.common.show")
                      }
                    >
                      {product.isAvailable ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink transition hover:border-tomato hover:text-tomato"
                      aria-label={t("admin.common.delete")}
                      title={t("admin.common.delete")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FAB — New product */}
      {categories.length > 0 && (
        <button
          type="button"
          onClick={openCreateForm}
          className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-white shadow-[0_4px_20px_rgba(31,138,112,0.45)] transition hover:bg-ink active:scale-95"
          aria-label={t("admin.products.new")}
          title={t("admin.products.new")}
        >
          <Plus size={24} />
        </button>
      )}

      {/* Product form modal */}
      <Modal
        isOpen={isFormOpen}
        title={editingProduct ? t("admin.products.edit") : t("admin.products.new")}
        closeLabel={t("admin.common.close")}
        onClose={closeForm}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeForm}>
              {t("admin.common.cancel")}
            </Button>
            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={categories.length === 0}
              isLoading={isSaving}
            >
              {isSaving ? t("admin.common.saving") : t("admin.common.save")}
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(event) => event.preventDefault()}
          className="max-h-[60svh] space-y-5 overflow-y-auto px-5 py-5"
        >
          {saveError ? (
            <Feedback message={saveError} tone="error" className="mb-1" />
          ) : null}

          {/* Name */}
          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.products.name")} *
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((c) => ({ ...c, name: event.target.value }))
              }
              placeholder={t("admin.products.namePlaceholder")}
              required
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.products.descriptionLabel")}
            </span>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((c) => ({ ...c, description: event.target.value }))
              }
              placeholder={t("admin.products.descriptionPlaceholder")}
              rows={3}
              className="mt-2 w-full rounded-md border border-line bg-cream px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          {/* Price + Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.products.price")} *
              </span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                placeholder="0.00"
                required
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">
                {t("admin.products.category")} *
              </span>
              <select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((c) => ({ ...c, categoryId: event.target.value }))
                }
                required
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              >
                <option value="">{t("admin.products.choose")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Order */}
          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.common.order")}
            </span>
            <input
              type="number"
              min={1}
              value={orderInput}
              onChange={(event) => setOrderInput(event.target.value)}
              placeholder={String(products.length + 1)}
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          {/* Image */}
          <div>
            <ImageUpload
              label={t("admin.products.photo")}
              chooseLabel={t("admin.image.choose")}
              removeLabel={t("admin.image.remove")}
              emptyLabel={t("admin.image.emptyProduct")}
              file={imageFile}
              currentUrl={form.imageUrl}
              aspect="wide"
              onFileChange={setImageFile}
              onRemove={() => setForm((c) => ({ ...c, imageUrl: "" }))}
            />
          </div>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.products.photoLink")}
            </span>
            <input
              value={form.imageUrl}
              onChange={(event) =>
                setForm((c) => ({ ...c, imageUrl: event.target.value }))
              }
              placeholder={t("admin.products.photoLinkPlaceholder")}
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          {/* Toggles */}
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-line bg-cream px-4 py-3">
              <span className="text-sm font-black text-ink">
                {t("admin.common.available")}
              </span>
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(event) =>
                  setForm((c) => ({ ...c, isAvailable: event.target.checked }))
                }
                className="h-5 w-5 accent-leaf"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-line bg-cream px-4 py-3">
              <span className="text-sm font-black text-ink">
                {t("admin.products.featured")}
              </span>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) =>
                  setForm((c) => ({ ...c, isFeatured: event.target.checked }))
                }
                className="h-5 w-5 accent-leaf"
              />
            </label>
          </div>
        </form>
      </Modal>
    </>
  );
}
