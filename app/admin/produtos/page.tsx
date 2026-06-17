"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Pencil, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { useAdminData } from "@/components/admin/admin-data-provider";
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
  const [form, setForm] = useState<ProductFormInput>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingProduct) {
      setForm({
        ...emptyForm,
        categoryId: categories[0]?.id ?? "",
        order: products.length + 1
      });
      setImageFile(null);
      return;
    }

    setForm({
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      categoryId: editingProduct.categoryId,
      imageUrl: editingProduct.imageUrl,
      isAvailable: editingProduct.isAvailable,
      isFeatured: editingProduct.isFeatured,
      order: editingProduct.order
    });
    setImageFile(null);
  }, [categories, editingProduct, products.length]);

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

      const input = { ...form, imageUrl };

      if (editingProduct) {
        await updateProduct(editingProduct.id, input);
        setStatusMessage("Produto atualizado.");
      } else {
        await createProduct(restaurant.id, input);
        setStatusMessage("Produto criado.");
      }

      setEditingProduct(null);
      await refresh();
    } catch {
      setStatusMessage("Não foi possível salvar o produto.");
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
    const confirmed = window.confirm(`Excluir o produto "${product.name}"?`);
    if (!confirmed) return;

    await deleteProduct(product.id);
    await refresh();
  }

  if (isLoading || !restaurant) {
    return (
      <AdminPageHeader
        title="Produtos"
        description={errorMessage || "Carregando produtos do cardápio."}
      />
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Produtos"
        description="Adicione e edite os itens que aparecem no cardápio dos clientes."
      />

      {categories.length === 0 ? (
        <p className="mb-5 rounded-md border border-line bg-white px-4 py-3 text-sm font-bold text-ink/68 shadow-soft">
          Crie uma categoria antes de adicionar produtos.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,430px)_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-line bg-white p-5 shadow-soft"
        >
          <h2 className="text-lg font-black text-ink">
            {editingProduct ? "Editar produto" : "Novo produto"}
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

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-ink">Preço</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: Number(event.target.value)
                  }))
                }
                required
                className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-ink">Categoria</span>
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
                <option value="">Escolha</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-bold text-ink">Foto</span>
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

          <label className="mt-4 block">
            <span className="text-sm font-bold text-ink">Link da foto</span>
            <input
              value={form.imageUrl}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  imageUrl: event.target.value
                }))
              }
              placeholder="Opcional se enviar arquivo"
              className="mt-2 min-h-12 w-full rounded-md border border-line bg-cream px-3 text-sm font-semibold text-ink outline-none focus:border-leaf"
            />
          </label>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-4 rounded-md border border-line bg-cream px-4 py-3">
              <span className="text-sm font-black text-ink">Disponível</span>
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
              <span className="text-sm font-black text-ink">Destaque</span>
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

          {statusMessage ? (
            <p className="mt-4 rounded-md border border-line bg-cream px-3 py-2 text-sm font-bold text-ink/68">
              {statusMessage}
            </p>
          ) : null}

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              disabled={isSaving || categories.length === 0}
              className="min-h-12 flex-1 rounded-md bg-leaf px-4 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
            {editingProduct ? (
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="min-h-12 rounded-md border border-line bg-white px-4 py-3 text-sm font-black text-ink transition hover:border-leaf"
              >
                Cancelar
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-md border border-line bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-ink">Seus produtos</h2>

          <div className="mt-4 grid gap-3">
            {products.length === 0 ? (
              <p className="rounded-md border border-line bg-cream px-4 py-3 text-sm font-semibold text-ink/68">
                Adicione o primeiro produto do cardápio.
              </p>
            ) : null}

            {products.map((product) => {
              const categoryName =
                categories.find((category) => category.id === product.categoryId)
                  ?.name ?? "Sem categoria";

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
                        {categoryName} · {product.isAvailable ? "Disponível" : "Oculto"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.isFeatured ? (
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-leaf"
                        title="Destaque"
                      >
                        <Star size={17} />
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                      aria-label="Editar produto"
                      title="Editar"
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleToggle(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-leaf hover:text-leaf"
                      aria-label="Mostrar ou ocultar produto"
                      title={product.isAvailable ? "Ocultar" : "Mostrar"}
                    >
                      {product.isAvailable ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink transition hover:border-tomato hover:text-tomato"
                      aria-label="Excluir produto"
                      title="Excluir"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
