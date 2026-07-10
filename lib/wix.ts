import { getScaledToFillImageUrl } from "@wix/sdk/media"

/**
 * Shared Wix constants + pure helpers. This module deliberately imports NO
 * Wix SDK API modules so that pages which only need constants (footer,
 * static pages) don't pull the SDK into their bundle. The actual clients
 * live in lib/wix-store.ts, lib/wix-cart.ts, lib/wix-bookings.ts and
 * lib/wix-data.ts — one per capability, so each route bundles only the SDK
 * surface it uses.
 */

/** The PUBLIC visitor OAuth client id (not a secret). */
export const WIX_CLIENT_ID = "df5c40c1-a8f1-445e-bc50-c7704b2ce241"

/** Wix Stores app id — the cart's catalogReference.appId for products. */
export const WIX_STORES_APP_ID = "215238eb-22a5-4c36-9e7b-e7c08025e04e"
/** Wix Bookings app id — the cart's catalogReference.appId for bookings. */
export const WIX_BOOKINGS_APP_ID = "13d21c63-b5ec-5912-8397-c3a5ddb27a97"
/** Staff-member resource type id (ANY_RESOURCE fallback). */
export const STAFF_MEMBER_RESOURCE_TYPE_ID =
  "1cd44cf8-756f-41c3-bd90-3e2ffcaf1155"

/** CMS collection id for the FAQs collection (fields: question, answer, order). */
export const FAQ_COLLECTION_ID = "FAQs"
/** CMS collection id for the AR data layers (fields: name, shortDescription, batteryCostOrRefreshRate, availability, featuredNote, order). */
export const DATA_LAYERS_COLLECTION_ID = "DataLayers"
/** CMS collection id for testimonials (fields: quote, name, neighborhood, context, order). */
export const TESTIMONIALS_COLLECTION_ID = "Testimonials"
/** Slug of the free demo-ride booking service (the primary business action). */
export const DEMO_RIDE_SERVICE_SLUG = "demo-ride-fitting"

/** Business facts used across the footer, contact page, and JSON-LD. */
export const BUSINESS = {
  name: "HaloRide",
  email: "hello@haloride.example",
  phone: "+45 31 62 84 07",
  street: "14 Cykelgade",
  city: "Copenhagen 2200",
  country: "Denmark",
  hours: "Tuesday–Saturday, 10:00–18:00",
  instagram: "https://instagram.example/haloride",
  tiktok: "https://tiktok.example/@haloride",
} as const

/** Notify listeners (e.g. the header badge) that the cart changed. */
export function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("haloride:cart-updated"))
  }
}

/**
 * localStorage flag marking that this visitor has (or had) a Wix cart.
 * Until the flag is set we never call `carts/current` — for a fresh visitor
 * that endpoint 404s, which shows up as a console error on every page.
 */
const HAS_CART_KEY = "haloride:has-cart"

/** True when a previous add-to-cart succeeded for this visitor. */
export function hasStoredCart(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(HAS_CART_KEY) === "1"
  } catch {
    return false
  }
}

/** Remember that this visitor now has a cart (first add-to-cart succeeded). */
export function markStoredCart() {
  try {
    window.localStorage.setItem(HAS_CART_KEY, "1")
  } catch {
    // localStorage unavailable (private mode) — worst case we skip the badge.
  }
}

/**
 * Resolve any Wix media value into an https URL for <img src>.
 * Handles wix:image:// identifiers, absolute URLs, and {url} objects.
 * Returns "" when there is no usable image (render a placeholder instead).
 */
export function imgSrc(mediaVal: unknown, w = 600, h = 600): string {
  const m = mediaVal as { image?: unknown; url?: unknown } | string | undefined
  const v =
    (typeof m === "object" && m !== null ? (m.image ?? m.url) : undefined) ?? m
  if (!v) return ""
  if (typeof v === "string" && v.startsWith("wix:image://")) {
    return getScaledToFillImageUrl(v, w, h, {})
  }
  if (typeof v === "string") {
    return v.startsWith("http") ? v : ""
  }
  const url = (v as { url?: string }).url
  return typeof url === "string" ? url : ""
}

/** Format a price amount (Wix amounts are strings) with an optional currency. */
export function formatPrice(
  amount?: string | number | null,
  currency?: string | null
): string {
  if (amount === undefined || amount === null || amount === "") return ""
  const n = Number(amount)
  if (Number.isNaN(n)) return String(amount)
  if (currency) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(n)
    } catch {
      // fall through to the plain format
    }
  }
  return `$${n.toFixed(2)}`
}
