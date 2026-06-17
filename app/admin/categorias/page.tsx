"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
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
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingCategory) {
      setForm({
        ...emptyForm,
        order: categories.length + 1
      });
      return;
    }

    setForm({
      name: editingCategory.name,
      order: editingCategory.order,
      isActive: editingCategory.isActive
    });
  }, [categories.length, editingCategory]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!restaurant) return;

    setIsSaving(true);
    setStatusMessage("");

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
        setStatusMessage("Categoria atualizada.");
      } else {
        await createCategory(restaurant.id, form);
        setStatusMessage("Categoria criada.");
      }

      setEditingCategory(null);
      await refresh();
    } catch {
      setStatusMessage("Não foi possível salvar a categoria.");
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
    const confirmed = window.confirm(`Excluir a categoria "${category.name}"?`);
    if (!confirmed) return;

    await deleteCategory(category.id);
    await refresh();
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title="Categorias"
        description={errorMessage || "Carregando categorias do cardápio."}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Categorias"
        description="Use categorias para separar pizzas, bebidas, sobremesas e outras partes do cardápio."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-line bg-white p-5 shadow-soft"
        >
          <h2 className="text-lg font-black text-ink">
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </h2>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-ink">Nome</span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-ink">Ordem</span>
            <input
              type="number"
              min={1}
              value={form.order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  order: Number(event.target.value)
                }))
              }
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <label className="mt-4 flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
            <span className="text-sm font-black text-ink">Aparece no cardápio</span>
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

          {statusMessage ? (
            <p className="mt-4 rounded-md border border-line bg-cream px-3 py-2 text-sm font-bold text-ink/68">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="min-h-12 flex-1 rounded-md bg-leaf px-4 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
            {editingCategory ? (
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="min-h-12 rounded-md border border-line bg-white px-4 py-3 text-sm font-black text-ink transition hover:border-leaf"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-ink">Suas categorias</h2>

          <div className="mt-4 grid gap-3">
            {categories.length === 0 ? (
              <p className="rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink/68">
                Crie a primeira categoria para começar a cadastrar produtos.
              </p>
            ) : null}

            {categories.map((category) => (
              <article
                key={category.id}
                className="flex flex-col gap-3 rounded-md border border-line bg-cream p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-black text-ink">{category.name}</p>
                  <p className="mt-1 text-xs font-semibold text-ink/50">
                    Ordem {category.order} ·{" "}
                    {category.isActive ? "Visível" : "Oculta"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(category)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                    aria-label="Editar categoria"
                    title="Editar"
                  >
                    <Pencil size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleToggle(category)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                    aria-label="Mostrar ou ocultar categoria"
                    title={category.isActive ? "Ocultar" : "Mostrar"}
                  >
                    {category.isActive ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-tomato hover:text-tomato"
                    aria-label="Excluir categoria"
                    title="Excluir"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
