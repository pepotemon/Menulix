"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useAuth } from "@/components/admin/auth-provider";
import { getAdminMenuData } from "@/lib/admin-firestore";
import type { Category, Product, Restaurant } from "@/types/menu";

type AdminDataContextValue = {
  restaurant: Restaurant | null;
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  errorMessage: string;
  refresh: () => Promise<void>;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

interface AdminDataProviderProps {
  children: React.ReactNode;
}

export function AdminDataProvider({
  children
}: AdminDataProviderProps): JSX.Element {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async (): Promise<void> => {
    if (!user) {
      setRestaurant(null);
      setCategories([]);
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getAdminMenuData(user.uid);
      setRestaurant(data.restaurant);
      setCategories(data.categories);
      setProducts(data.products);
    } catch {
      setErrorMessage(
        "Não foi possível carregar seu cardápio. Tente novamente em alguns instantes."
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthLoading) {
      void refresh();
    }
  }, [isAuthLoading, refresh]);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      restaurant,
      categories,
      products,
      isLoading,
      errorMessage,
      refresh
    }),
    [categories, errorMessage, isLoading, products, refresh, restaurant]
  );

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData(): AdminDataContextValue {
  const context = useContext(AdminDataContext);

  if (!context) {
    throw new Error("useAdminData deve ser usado dentro de AdminDataProvider.");
  }

  return context;
}
