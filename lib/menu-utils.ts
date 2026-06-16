import type { OpeningHours, Weekday } from "@/types/menu";

const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const weekdayLabels: Record<Weekday, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo"
};

export function formatCurrencyBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

export function normalizeWhatsappNumber(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsappUrl(phone: string, restaurantName: string) {
  const message =
    "Olá, vim pelo cardápio digital da Menulix e gostaria de fazer um pedido.";
  const encodedMessage = encodeURIComponent(`${message}\n\n${restaurantName}`);

  return `https://wa.me/${normalizeWhatsappNumber(phone)}?text=${encodedMessage}`;
}

export function getTodaysOpeningLabel(openingHours: OpeningHours, date = new Date()) {
  const today = weekdays[date.getDay()];
  const periods = openingHours[today];

  if (!periods?.length) {
    return "Fechado hoje";
  }

  return periods.map((period) => `${period.opens} as ${period.closes}`).join(" / ");
}

export function formatWeeklyOpeningHours(openingHours: OpeningHours) {
  const orderedWeekdays: Weekday[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];

  return orderedWeekdays.map((day) => {
    const periods = openingHours[day];
    const label = periods?.length
      ? periods.map((period) => `${period.opens} as ${period.closes}`).join(" / ")
      : "Fechado";

    return {
      day: weekdayLabels[day],
      label
    };
  });
}

export function isRestaurantOpen(openingHours: OpeningHours, date = new Date()) {
  const today = weekdays[date.getDay()];
  const periods = openingHours[today];

  if (!periods?.length) {
    return false;
  }

  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  return periods.some((period) => {
    const [openHour, openMinute] = period.opens.split(":").map(Number);
    const [closeHour, closeMinute] = period.closes.split(":").map(Number);
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  });
}
