import { notFound } from "next/navigation";
import { InactiveRestaurant } from "@/components/public-menu/inactive-restaurant";
import { PublicMenuPage } from "@/components/public-menu/public-menu-page";
import { getPublicMenuBySlug, getKnownRestaurantSlugs } from "@/lib/firestore";

// Regenera a página no máximo a cada 60 segundos
export const revalidate = 60;

type RestaurantPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const slugs = await getKnownRestaurantSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const menu = await getPublicMenuBySlug(params.slug);

  if (!menu) {
    notFound();
  }

  if (!menu.restaurant.isActive) {
    return <InactiveRestaurant restaurant={menu.restaurant} />;
  }

  return <PublicMenuPage menu={menu} />;
}
