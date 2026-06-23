"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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

  async function handleSave(): Promise<void> {
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
        <Feedback className="mb-5" message={t("admin.products.needCategory")} />
      ) : null}

      {statusMessage && statusMessage !== t("admin.products.saveError") ? (
        <Feedback
          className="mb-5"
          message={statusMessage}
          tone={
            statusMessage === t("admin.products.saveError") ? "error" : "success"
          }
        />
      ) : null}

      <section className="rounded-md border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-black text-ink">
            {t("admin.products.list")}
          </h2>
          <Button
            type="button"
            onClick={openCreateForm}
            disabled={categories.length === 0}
          >
            <Plus aria-hidden="true" size={18} />
            {t("admin.products.new")}
          </Button>
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
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-md border border-line bg-white text-ink/35">
                      <ImageIcon aria-hidden="true" size={18} />
                      <span className="mt-1 text-sm font-black">
                        {product.name.trim().charAt(0).toUpperCase()}
                      </span>
                    </div>
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

      <Modal
        isOpen={isFormOpen}
        title={
          editingProduct ? t("admin.products.edit") : t("admin.products.new")
        }
        eyebrow={`${t("admin.products.stepLabel")} ${formStep + 1}/3`}
        closeLabel={t("admin.common.close")}
        onClose={closeForm}
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                formStep === 0 ? closeForm() : setFormStep((step) => step - 1)
              }
            >
              {formStep === 0 ? (
                t("admin.common.cancel")
              ) : (
                <>
                  <ArrowLeft aria-hidden="true" size={17} />
                  {t("admin.common.back")}
                </>
              )}
            </Button>

            {formStep < 2 ? (
              <Button
                type="button"
                onClick={() => setFormStep((step) => step + 1)}
                disabled={
                  (formStep === 0 && !canGoToStepTwo) ||
                  (formStep === 1 && !canGoToStepThree)
                }
              >
                {t("admin.common.next")}
                <ArrowRight aria-hidden="true" size={17} />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => void handleSave()}
                disabled={categories.length === 0}
                isLoading={isSaving}
              >
                {isSaving ? t("admin.common.saving") : t("admin.common.save")}
              </Button>
            )}
          </div>
        }
      >
        <form onSubmit={(event) => event.preventDefault()}>
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
              {statusMessage === t("admin.products.saveError") ? (
                <Feedback
                  className="mb-4"
                  message={statusMessage}
                  tone="error"
                />
              ) : null}
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
                  <ImageUpload
                    label={t("admin.products.photo")}
                    chooseLabel={t("admin.image.choose")}
                    removeLabel={t("admin.image.remove")}
                    emptyLabel={t("admin.image.emptyProduct")}
                    file={imageFile}
                    currentUrl={form.imageUrl}
                    aspect="wide"
                    onFileChange={setImageFile}
                    onRemove={() =>
                      setForm((current) => ({ ...current, imageUrl: "" }))
                    }
                  />

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

          </form>
      </Modal>
    </>
  );
}
