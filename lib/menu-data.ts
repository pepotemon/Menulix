import type { Category, Product, PublicMenu, Restaurant } from "@/types/menu";

const now = "2026-06-16T12:00:00.000Z";

export const restaurants: Restaurant[] = [
  {
    id: "restaurant_alex_pizzaria",
    slug: "alexpizzaria",
    name: "Alex Pizzaria",
    description:
      "Pizzas artesanais, combos para família e bebidas geladas no ponto certo.",
    logoUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=256&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=85",
    whatsapp: "+55 11 99999-0000",
    instagram: "alexpizzaria",
    address: "Rua das Oliveiras, 120",
    city: "São Paulo",
    state: "SP",
    isActive: true,
    theme: {
      primaryColor: "#D94E35",
      secondaryColor: "#1F8A70",
      backgroundColor: "#FFF7EC",
      textColor: "#1E2528"
    },
    openingHours: {
      monday: [{ opens: "18:00", closes: "23:00" }],
      tuesday: [{ opens: "18:00", closes: "23:00" }],
      wednesday: [{ opens: "18:00", closes: "23:00" }],
      thursday: [{ opens: "18:00", closes: "23:30" }],
      friday: [{ opens: "18:00", closes: "00:00" }],
      saturday: [{ opens: "18:00", closes: "00:00" }],
      sunday: [{ opens: "18:00", closes: "23:00" }]
    },
    createdAt: now,
    updatedAt: now
  },
  {
    id: "restaurant_inactive_demo",
    slug: "restauranteinativo",
    name: "Restaurante em Ajuste",
    description: "Este cardápio está temporariamente indisponível.",
    logoUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=256&q=80",
    bannerUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85",
    whatsapp: "+55 11 98888-0000",
    address: "Avenida Central, 10",
    city: "São Paulo",
    state: "SP",
    isActive: false,
    theme: {
      primaryColor: "#1F8A70",
      secondaryColor: "#D94E35",
      backgroundColor: "#FFF7EC",
      textColor: "#1E2528"
    },
    openingHours: {},
    createdAt: now,
    updatedAt: now
  }
];

export const categories: Category[] = [
  {
    id: "category_pizzas",
    restaurantId: "restaurant_alex_pizzaria",
    name: "Pizzas",
    order: 1,
    isActive: true
  },
  {
    id: "category_bebidas",
    restaurantId: "restaurant_alex_pizzaria",
    name: "Bebidas",
    order: 2,
    isActive: true
  },
  {
    id: "category_combos",
    restaurantId: "restaurant_alex_pizzaria",
    name: "Combos",
    order: 3,
    isActive: true
  }
];

export const products: Product[] = [
  {
    id: "product_marguerita",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_pizzas",
    name: "Pizza Marguerita",
    description: "Molho de tomate, mussarela, rodelas de tomate e manjericão fresco.",
    price: 39.9,
    imageUrl:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: true,
    order: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product_calabresa",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_pizzas",
    name: "Pizza Calabresa",
    description: "Calabresa fatiada, cebola, mussarela e orégano.",
    price: 42.9,
    imageUrl:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: false,
    order: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product_portuguesa",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_pizzas",
    name: "Pizza Portuguesa",
    description: "Presunto, ovos, cebola, ervilha, mussarela e azeitonas.",
    price: 46.9,
    imageUrl:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: true,
    order: 3,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product_coca",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_bebidas",
    name: "Coca-Cola 2L",
    description: "Refrigerante gelado para acompanhar sua pizza.",
    price: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: false,
    order: 1,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product_suco",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_bebidas",
    name: "Suco Natural",
    description: "Laranja, limão ou maracujá. Feito na hora.",
    price: 9.9,
    imageUrl:
      "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: false,
    order: 2,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "product_combo_familia",
    restaurantId: "restaurant_alex_pizzaria",
    categoryId: "category_combos",
    name: "Combo Família",
    description: "2 pizzas grandes, Coca-Cola 2L e borda recheada em uma pizza.",
    price: 89.9,
    imageUrl:
      "https://images.unsplash.com/photo-1548369937-47519962c11a?auto=format&fit=crop&w=640&q=80",
    isAvailable: true,
    isFeatured: true,
    order: 1,
    createdAt: now,
    updatedAt: now
  }
];

export function getPublicMenuBySlug(slug: string): PublicMenu | null {
  const restaurant = restaurants.find((item) => item.slug === slug);

  if (!restaurant) {
    return null;
  }

  const restaurantCategories = categories
    .filter((category) => category.restaurantId === restaurant.id && category.isActive)
    .sort((a, b) => a.order - b.order);

  const restaurantProducts = products
    .filter((product) => product.restaurantId === restaurant.id)
    .sort((a, b) => a.order - b.order);

  return {
    restaurant,
    categories: restaurantCategories,
    products: restaurantProducts
  };
}

export function getKnownRestaurantSlugs() {
  return restaurants.map((restaurant) => restaurant.slug);
}
