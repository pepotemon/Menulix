import type { OpeningHours, Weekday } from "@/types/menu";
import { dictionary, defaultLanguage, type Language } from "@/lib/i18n";

const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday"
];

const weekdayLabelKeys: Record<Weekday, keyof typeof dictionary.pt> = {
  monday: "menu.weekday.monday",
  tuesday: "menu.weekday.tuesday",
  wednesday: "menu.weekday.wednesday",
  thursday: "menu.weekday.thursday",
  friday: "menu.weekday.friday",
  saturday: "menu.weekday.saturday",
  sunday: "menu.weekday.sunday"
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

export function buildWhatsappUrl(
  phone: string,
  restaurantName: string,
  language: Language = defaultLanguage
) {
  const message = dictionary[language]["whatsapp.message"];
  const encodedMessage = encodeURIComponent(`${message}\n\n${restaurantName}`);

  return `https://wa.me/${normalizeWhatsappNumber(phone)}?text=${encodedMessage}`;
}

export function getTodaysOpeningLabel(
  openingHours: OpeningHours,
  date = new Date(),
  language: Language = defaultLanguage
) {
  const today = weekdays[date.getDay()];
  const periods = openingHours[today];

  if (!periods?.length) {
    return dictionary[language]["menu.closedToday"];
  }

  return periods.map((period) => `${period.opens} as ${period.closes}`).join(" / ");
}

export function formatWeeklyOpeningHours(
  openingHours: OpeningHours,
  language: Language = defaultLanguage
) {
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
      : dictionary[language]["menu.closed"];

    return {
      day: dictionary[language][weekdayLabelKeys[day]],
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
