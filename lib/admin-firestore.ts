import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import type {
  Category,
  CategoryFormInput,
  Product,
  ProductFormInput,
  Restaurant,
  RestaurantFormInput
} from "@/types/menu";

type AdminMenuData = {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
};

const defaultTheme = {
  primaryColor: "#1F8A70",
  secondaryColor: "#D94E35",
  backgroundColor: "#FFF7EC",
  textColor: "#1E2528"
};

export function slugifyRestaurantName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function getAdminMenuData(ownerId: string): Promise<AdminMenuData> {
  const restaurant = await getOrCreateRestaurant(ownerId);
  const [categoriesSnap, productsSnap] = await Promise.all([
    getDocs(
      query(collection(db, "categories"), where("restaurantId", "==", restaurant.id))
    ),
    getDocs(
      query(collection(db, "products"), where("restaurantId", "==", restaurant.id))
    )
  ]);

  const categories = categoriesSnap.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Category)
    .sort((a, b) => a.order - b.order);

  const products = productsSnap.docs
    .map((item) => ({ id: item.id, ...item.data() }) as Product)
    .sort((a, b) => a.order - b.order);

  return { restaurant, categories, products };
}

export async function getOrCreateRestaurant(ownerId: string): Promise<Restaurant> {
  const restaurantsSnap = await getDocs(
    query(collection(db, "restaurants"), where("ownerId", "==", ownerId))
  );

  if (!restaurantsSnap.empty) {
    const restaurantDoc = restaurantsSnap.docs[0];
    return { id: restaurantDoc.id, ...restaurantDoc.data() } as Restaurant;
  }

  const now = new Date().toISOString();
  const restaurantRef = doc(collection(db, "restaurants"));
  const restaurant: Omit<Restaurant, "id"> = {
    ownerId,
    slug: `meu-cardapio-${ownerId.slice(0, 6).toLowerCase()}`,
    name: "Meu restaurante",
    description: "Cardápio digital",
    logoUrl: "",
    bannerUrl: "",
    whatsapp: "",
    instagram: "",
    address: "",
    city: "",
    state: "",
    isActive: false,
    theme: defaultTheme,
    openingHours: {},
    createdAt: now,
    updatedAt: now
  };

  await setDoc(restaurantRef, restaurant);

  return { id: restaurantRef.id, ...restaurant };
}

export async function saveRestaurant(
  restaurantId: string,
  input: RestaurantFormInput
): Promise<void> {
  await updateDoc(doc(db, "restaurants", restaurantId), {
    ...input,
    slug: slugifyRestaurantName(input.slug),
    updatedAt: new Date().toISOString()
  });
}

export async function createCategory(
  restaurantId: string,
  input: CategoryFormInput
): Promise<void> {
  await addDoc(collection(db, "categories"), {
    ...input,
    restaurantId
  });
}

export async function updateCategory(
  categoryId: string,
  input: CategoryFormInput
): Promise<void> {
  await updateDoc(doc(db, "categories", categoryId), input);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await deleteDoc(doc(db, "categories", categoryId));
}

export async function createProduct(
  restaurantId: string,
  input: ProductFormInput
): Promise<void> {
  const now = new Date().toISOString();
  await addDoc(collection(db, "products"), {
    ...input,
    restaurantId,
    createdAt: now,
    updatedAt: now
  });
}

export async function updateProduct(
  productId: string,
  input: ProductFormInput
): Promise<void> {
  await updateDoc(doc(db, "products", productId), {
    ...input,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, "products", productId));
}

export async function uploadProductImage(
  restaurantId: string,
  file: File
): Promise<string> {
  const extension = file.name.split(".").pop() ?? "jpg";
  const storagePath = `restaurants/${restaurantId}/products/${crypto.randomUUID()}.${extension}`;
  const imageRef = ref(storage, storagePath);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
