export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type OpeningPeriod = {
  opens: string;
  closes: string;
};

export type OpeningHours = Partial<Record<Weekday, OpeningPeriod[]>>;

export type RestaurantTheme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
};

export type RestaurantTemplate =
  | "pizzaria"
  | "hamburgueria"
  | "acai"
  | "marmitaria"
  | "cafeteria"
  | "sushi"
  | "doceria";

export type Restaurant = {
  id: string;
  ownerId?: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  whatsapp: string;
  instagram?: string;
  address: string;
  city: string;
  state: string;
  isActive: boolean;
  template?: RestaurantTemplate;
  theme: RestaurantTheme;
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  restaurantId: string;
  name: string;
  order: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicMenu = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type RestaurantFormInput = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  whatsapp: string;
  instagram: string;
  address: string;
  city: string;
  state: string;
  isActive: boolean;
  openingHours: OpeningHours;
};

export type CategoryFormInput = {
  name: string;
  order: number;
  isActive: boolean;
};

export type ProductFormInput = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  order: number;
};

export type AppearanceFormInput = {
  template: RestaurantTemplate;
  logoUrl: string;
  bannerUrl: string;
  theme: RestaurantTheme;
};
