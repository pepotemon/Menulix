"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
import { useI18n } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import {
  createCategory,
  deleteCategory,
  updateCategory
} from "@/lib/admin-firestore";
import type { Category, CategoryFormInput } from "@/types/menu";

const emptyForm: CategoryFormInput = {
  name: "",
  order: 1,
  isActive: true
};

export default function AdminCategoriesPage(): JSX.Element {
  const { restaurant, categories, isLoading, errorMessage, refresh } =
    useAdminData();
  const { t } = useI18n();
  const { showToast } = useToast();
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [orderInput, setOrderInput] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!editingCategory) {
      setForm({ ...emptyForm, order: categories.length + 1 });
      setOrderInput("");
      return;
    }
    setForm({
      name: editingCategory.name,
      order: editingCategory.order,
      isActive: editingCategory.isActive
    });
    setOrderInput(String(editingCategory.order));
  }, [categories.length, editingCategory]);

  function openCreateForm(): void {
    setEditingCategory(null);
    setForm({ ...emptyForm, order: categories.length + 1 });
    setOrderInput("");
    setSaveError("");
    setIsFormOpen(true);
  }

  function openEditForm(category: Category): void {
    setEditingCategory(category);
    setSaveError("");
    setIsFormOpen(true);
  }

  function closeForm(): void {
    setIsFormOpen(false);
    setEditingCategory(null);
    setSaveError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!restaurant) return;

    setIsSaving(true);
    setSaveError("");

    try {
      const parsedOrder = Number(orderInput);
      const categoryInput: CategoryFormInput = {
        ...form,
        order:
          Number.isFinite(parsedOrder) && parsedOrder > 0
            ? parsedOrder
            : categories.length + 1
      };

      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryInput);
        showToast(t("admin.categories.updated"), "success");
      } else {
        await createCategory(restaurant.id, categoryInput);
        showToast(t("admin.categories.created"), "success");
      }

      closeForm();
      await refresh();
    } catch {
      setSaveError(t("admin.categories.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(category: Category): Promise<void> {
    await updateCategory(category.id, {
      name: category.name,
      order: category.order,
      isActive: !category.isActive
    });
    await refresh();
  }

  async function handleDelete(category: Category): Promise<void> {
    const confirmed = window.confirm(
      `${t("admin.categories.deleteConfirm")} "${category.name}"?`
    );
    if (!confirmed) return;

    await deleteCategory(category.id);
    await refresh();
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title={t("admin.categories.title")}
        description={errorMessage || t("admin.categories.loading")}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title={t("admin.categories.title")}
        description={t("admin.categories.description")}
      />

      <section className="rounded-md border border-line bg-white shadow-soft">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-base font-black text-ink">
            {t("admin.categories.list")}
          </h2>
          <Button type="button" size="sm" onClick={openCreateForm}>
            <Plus aria-hidden="true" size={16} />
            {t("admin.categories.new")}
          </Button>
        </div>

        {categories.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm font-semibold text-ink/50">
            {t("admin.categories.empty")}
          </p>
        ) : (
          <div className="divide-y divide-line">
            {categories.map((category) => (
              <article
                key={category.id}
                className="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-black text-ink">{category.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-ink/40">
                    {t("admin.common.order")} {category.order} ·{" "}
                    {category.isActive
                      ? t("admin.common.visible")
                      : t("admin.common.hidden")}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditForm(category)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink transition hover:border-leaf hover:text-leaf"
                    aria-label={t("admin.common.edit")}
                    title={t("admin.common.edit")}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggle(category)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-cream text-ink transition hover:border-leaf hover:text-leaf"
                    title={
                      category.isActive
                        ? t("admin.common.hide")
                        : t("admin.common.show")
                    }
                  >
                    {category.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category)}
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
        )}
      </section>

      <Modal
        isOpen={isFormOpen}
        title={
          editingCategory
            ? t("admin.categories.edit")
            : t("admin.categories.new")
        }
        closeLabel={t("admin.common.close")}
        onClose={closeForm}
        maxWidthClassName="max-w-md"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={closeForm}>
              {t("admin.common.cancel")}
            </Button>
            <Button type="submit" form="category-form" isLoading={isSaving}>
              {isSaving ? t("admin.common.saving") : t("admin.common.save")}
            </Button>
          </div>
        }
      >
        <form
          id="category-form"
          onSubmit={handleSubmit}
          className="space-y-4 px-5 py-5"
        >
          {saveError ? (
            <Feedback message={saveError} tone="error" />
          ) : null}

          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.categories.name")} *
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((c) => ({ ...c, name: event.target.value }))
              }
              required
              autoFocus
              placeholder="Ex: Pizzas, Bebidas, Sobremesas"
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink">
              {t("admin.common.order")}
            </span>
            <input
              type="number"
              min={1}
              value={orderInput}
              onChange={(event) => setOrderInput(event.target.value)}
              placeholder={String(categories.length + 1)}
              className="mt-2 min-h-11 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
            <span className="mt-1.5 block text-xs font-semibold text-ink/40">
              {t("admin.categories.orderHelp")}
            </span>
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-line bg-cream px-4 py-3">
            <span className="text-sm font-black text-ink">
              {t("admin.categories.visible")}
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
        </form>
      </Modal>
    </>
  );
}
