"use client";

import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsSummary
} from "@/types/menu";

type TrackAnalyticsInput = {
  restaurantId: string;
  type: AnalyticsEventType;
  productId?: string;
  productName?: string;
  categoryId?: string;
  categoryName?: string;
  total?: number;
  itemCount?: number;
  language?: string;
};

const EMPTY_SUMMARY: AnalyticsSummary = {
  menuViews: 0,
  categoryClicks: 0,
  productClicks: 0,
  whatsappClicks: 0,
  cartOrdersSent: 0,
  estimatedRevenue: 0,
  topProducts: [],
  recentEvents: []
};

export async function trackAnalyticsEvent(
  input: TrackAnalyticsInput
): Promise<void> {
  try {
    await addDoc(collection(db, "analyticsEvents"), {
      restaurantId: input.restaurantId,
      type: input.type,
      productId: input.productId ?? null,
      productName: input.productName ?? null,
      categoryId: input.categoryId ?? null,
      categoryName: input.categoryName ?? null,
      total: input.total ?? null,
      itemCount: input.itemCount ?? null,
      language: input.language ?? null,
      createdAt: serverTimestamp()
    });
  } catch {
    // Analytics must never block ordering or menu browsing.
  }
}

export async function getRestaurantAnalytics(
  restaurantId: string
): Promise<AnalyticsSummary> {
  const snapshot = await getDocs(
    query(
      collection(db, "analyticsEvents"),
      where("restaurantId", "==", restaurantId)
    )
  );

  const events = snapshot.docs.map<AnalyticsEvent>((doc) => {
    const data = doc.data();
    const createdAtValue = data.createdAt;
    const createdAt =
      createdAtValue && typeof createdAtValue.toDate === "function"
        ? createdAtValue.toDate().toISOString()
        : new Date().toISOString();

    return {
      id: doc.id,
      restaurantId: String(data.restaurantId ?? restaurantId),
      type: normalizeEventType(data.type),
      productId: asOptionalString(data.productId),
      productName: asOptionalString(data.productName),
      categoryId: asOptionalString(data.categoryId),
      categoryName: asOptionalString(data.categoryName),
      total: asOptionalNumber(data.total),
      itemCount: asOptionalNumber(data.itemCount),
      language: asOptionalString(data.language),
      createdAt
    };
  });

  return summarizeEvents(events);
}

function summarizeEvents(events: AnalyticsEvent[]): AnalyticsSummary {
  const summary: AnalyticsSummary = {
    ...EMPTY_SUMMARY,
    recentEvents: [...events]
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
      .slice(0, 8)
  };
  const productClicks = new Map<string, { productName: string; clicks: number }>();

  for (const event of events) {
    if (event.type === "menu_view") summary.menuViews += 1;
    if (event.type === "category_click") summary.categoryClicks += 1;
    if (event.type === "product_click") summary.productClicks += 1;
    if (event.type === "whatsapp_click") summary.whatsappClicks += 1;
    if (event.type === "cart_order_sent") {
      summary.cartOrdersSent += 1;
      summary.estimatedRevenue += event.total ?? 0;
    }

    if (event.type === "product_click" && event.productId) {
      const existing = productClicks.get(event.productId);
      productClicks.set(event.productId, {
        productName: event.productName ?? "Produto",
        clicks: (existing?.clicks ?? 0) + 1
      });
    }
  }

  summary.topProducts = [...productClicks.entries()]
    .map(([productId, item]) => ({ productId, ...item }))
    .sort((first, second) => second.clicks - first.clicks)
    .slice(0, 5);

  return summary;
}

function normalizeEventType(value: unknown): AnalyticsEventType {
  if (
    value === "menu_view" ||
    value === "category_click" ||
    value === "product_click" ||
    value === "whatsapp_click" ||
    value === "cart_order_sent"
  ) {
    return value;
  }

  return "menu_view";
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
