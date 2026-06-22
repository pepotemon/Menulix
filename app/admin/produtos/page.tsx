"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
  Trash2,
  Upload,
  X
} from "lucide-react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
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
  const [form, setForm] = useState<ProductFormInput>(emptyForm);
  const [priceInput, setPriceInput] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);

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
    setStatusMessage("");
    setFormStep(0);
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
    setStatusMessage("");
    setFormStep(0);
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setFormStep(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!restaurant) return;

    setIsSaving(true);
    setStatusMessage("");

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
        setStatusMessage(t("admin.products.updated"));
      } else {
        await createProduct(restaurant.id, input);
        setStatusMessage(t("admin.products.created"));
      }

      closeForm();
      await refresh();
    } catch {
      setStatusMessage(t("admin.products.saveError"));
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

  const canGoToStepTwo = form.name.trim().length > 0;
  const canGoToStepThree =
    priceInput.trim().length > 0 && form.categoryId.trim().length > 0;

  return (
    <>
      <AdminPageHeader
        title={t("admin.products.title")}
        description={t("admin.products.description")}
      />

      {categories.length === 0 ? (
        <p className="mb-5 rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink/68 shadow-soft">
          {t("admin.products.needCategory")}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="mb-5 rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink/68 shadow-soft">
          {statusMessage}
        </p>
      ) : null}

      <section className="rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-ink">
            {t("admin.products.list")}
          </h2>
          <button
            type="button"
            onClick={openCreateForm}
            disabled={categories.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 py-2 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus aria-hidden="true" size={18} />
            {t("admin.products.new")}
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          {products.length === 0 ? (
            <p className="rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink/68">
              {t("admin.products.empty")}
            </p>
          ) : null}

          {products.map((product) => {
            const categoryName =
              categories.find((category) => category.id === product.categoryId)
                ?.name ?? t("admin.products.noCategory");

            return (
              <article
                key={product.id}
                className="flex flex-col gap-3 rounded-md border border-line bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-3">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt=""
                      width={64}
                      height={64}
                      unoptimized
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-md border border-line bg-white" />
                  )}
                  <div>
                    <p className="text-base font-black text-ink">{product.name}</p>
                    <p className="mt-1 text-sm font-bold text-leaf">
                      {formatCurrencyBRL(product.price)}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-ink/50">
                      {categoryName} ·{" "}
                      {product.isAvailable
                        ? t("admin.common.available")
                        : t("admin.common.unavailable")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.isFeatured ? (
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-leaf"
                      title={t("admin.products.featured")}
                    >
                      <Star size={17} />
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openEditForm(product)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                    aria-label={t("admin.common.edit")}
                    title={t("admin.common.edit")}
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggle(product)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                    aria-label={t("admin.common.available")}
                    title={
                      product.isAvailable
                        ? t("admin.common.hide")
                        : t("admin.common.show")
                    }
                  >
                    {product.isAvailable ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(product)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-tomato hover:text-tomato"
                    aria-label={t("admin.common.delete")}
                    title={t("admin.common.delete")}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-3 py-4 backdrop-blur-sm sm:items-center">
          <form
            onSubmit={handleSubmit}
            className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-md border border-line bg-white shadow-soft"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase text-leaf">
                  {t("admin.products.stepLabel")} {formStep + 1}/3
                </p>
                <h2 className="mt-1 text-lg font-black text-ink">
                  {editingProduct
                    ? t("admin.products.edit")
                    : t("admin.products.new")}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-tomato hover:text-tomato"
                aria-label={t("admin.common.close")}
                title={t("admin.common.close")}
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 border-b border-line">
              {[
                t("admin.products.stepDetails"),
                t("admin.products.stepPrice"),
                t("admin.products.stepPhoto")
              ].map((label, index) => (
                <div
                  key={label}
                  className={`h-1 ${index <= formStep ? "bg-leaf" : "bg-line"}`}
                  title={label}
                />
              ))}
            </div>

            <div className="max-h-[62vh] overflow-y-auto px-5 py-5">
              {formStep === 0 ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.products.name")}
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
                      {t("admin.products.descriptionLabel")}
                    </span>
                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value
                        }))
                      }
                      rows={5}
                      className="mt-2 w-full rounded-md border border-line bg-cream px-3 py-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </label>
                </div>
              ) : null}

              {formStep === 1 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.products.price")}
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={priceInput}
                      onChange={(event) => setPriceInput(event.target.value)}
                      placeholder="0.00"
                      required
                      className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.products.category")}
                    </span>
                    <select
                      value={form.categoryId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          categoryId: event.target.value
                        }))
                      }
                      required
                      className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    >
                      <option value="">{t("admin.products.choose")}</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.common.order")}
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={orderInput}
                      onChange={(event) => setOrderInput(event.target.value)}
                      placeholder={String(products.length + 1)}
                      className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </label>
                </div>
              ) : null}

              {formStep === 2 ? (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.products.photo")}
                    </span>
                    <span className="mt-2 flex min-h-12 items-center gap-2 rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink">
                      <Upload size={18} className="text-ink/50" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          setImageFile(event.target.files?.[0] ?? null)
                        }
                        className="w-full text-sm"
                      />
                    </span>
                  </label>

                  {imageFile ? (
                    <p className="rounded-md border border-line bg-cream px-3 py-2 text-xs font-bold text-leaf">
                      {t("admin.products.photoSelected")}: {imageFile.name}
                    </p>
                  ) : null}

                  <label className="block">
                    <span className="text-sm font-bold text-ink">
                      {t("admin.products.photoLink")}
                    </span>
                    <input
                      value={form.imageUrl}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          imageUrl: event.target.value
                        }))
                      }
                      placeholder={t("admin.products.photoLinkPlaceholder")}
                      className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
                      <span className="text-sm font-black text-ink">
                        {t("admin.common.available")}
                      </span>
                      <input
                        type="checkbox"
                        checked={form.isAvailable}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            isAvailable: event.target.checked
                          }))
                        }
                        className="h-5 w-5 accent-leaf"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
                      <span className="text-sm font-black text-ink">
                        {t("admin.products.featured")}
                      </span>
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            isFeatured: event.target.checked
                          }))
                        }
                        className="h-5 w-5 accent-leaf"
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-line px-5 py-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  formStep === 0 ? closeForm() : setFormStep((step) => step - 1)
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-sm font-black text-ink transition hover:border-leaf"
              >
                {formStep === 0 ? (
                  t("admin.common.cancel")
                ) : (
                  <>
                    <ArrowLeft aria-hidden="true" size={17} />
                    {t("admin.common.back")}
                  </>
                )}
              </button>

              {formStep < 2 ? (
                <button
                  type="button"
                  onClick={() => setFormStep((step) => step + 1)}
                  disabled={
                    (formStep === 0 && !canGoToStepTwo) ||
                    (formStep === 1 && !canGoToStepThree)
                  }
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-leaf px-4 py-2 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t("admin.common.next")}
                  <ArrowRight aria-hidden="true" size={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSaving || categories.length === 0}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-leaf px-4 py-2 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? t("admin.common.saving") : t("admin.common.save")}
                </button>
              )}
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
