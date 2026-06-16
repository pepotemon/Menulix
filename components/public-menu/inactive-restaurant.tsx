import type { Restaurant } from "@/types/menu";

type InactiveRestaurantProps = {
  restaurant: Restaurant;
};

export function InactiveRestaurant({ restaurant }: InactiveRestaurantProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12">
      <section className="w-full max-w-xl rounded-lg border border-line bg-white p-6 text-center shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-tomato">
          Cardápio indisponível
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">{restaurant.name}</h1>
        <p className="mt-3 leading-relaxed text-ink/68">
          Este cardápio está temporariamente inativo. O restaurante pode estar
          ajustando produtos, horários ou informações de atendimento.
        </p>
      </section>
    </main>
  );
}
