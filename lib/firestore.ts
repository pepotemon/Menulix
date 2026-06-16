import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Category, Product, PublicMenu, Restaurant } from "@/types/menu";

export async function getPublicMenuBySlug(
  slug: string
): Promise<PublicMenu | null> {
  const restaurantSnap = await getDocs(
    query(collection(db, "restaurants"), where("slug", "==", slug))
  );

  if (restaurantSnap.empty) return null;

  const restaurantDoc = restaurantSnap.docs[0];
  const restaurant = {
    id: restaurantDoc.id,
    ...restaurantDoc.data(),
  } as Restaurant;

  const [categoriesSnap, productsSnap] = await Promise.all([
    getDocs(
      query(
        collection(db, "categories"),
        where("restaurantId", "==", restaurant.id)
      )
    ),
    getDocs(
      query(
        collection(db, "products"),
        where("restaurantId", "==", restaurant.id)
      )
    ),
  ]);

  const categories = categoriesSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Category)
    .filter((c) => c.isActive)
    .sort((a, b) => a.order - b.order);

  const products = productsSnap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
    .sort((a, b) => a.order - b.order);

  return { restaurant, categories, products };
}

export async function getKnownRestaurantSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, "restaurants"), where("isActive", "==", true))
  );
  return snap.docs.map((doc) => doc.data().slug as string);
}
