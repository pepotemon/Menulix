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

export type Restaurant = {
  id: string;
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
