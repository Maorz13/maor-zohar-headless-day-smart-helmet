import { createClient, OAuthStrategy, media } from "@wix/sdk"
import { productsV3, readOnlyVariantsV3 } from "@wix/stores"
import { currentCart } from "@wix/ecom"
import { redirects } from "@wix/redirects"
import { posts } from "@wix/blog"
import {
  services,
  availabilityTimeSlots,
  eventTimeSlots,
  bookings,
} from "@wix/bookings"
import { items } from "@wix/data"
import { forms } from "@wix/forms"
import {
  createCart,
  calculateCart,
  placeOrder,
} from "@wix/auto_sdk_ecom_cart-v-2"

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
 * The single shared Wix client. The clientId is the PUBLIC OAuth client id
 * (not a secret) — all data fetching happens client-side as an anonymous
 * visitor.
 */
export const wix = createClient({
  modules: {
    productsV3,
    readOnlyVariantsV3,
    currentCart,
    redirects,
    posts,
    services,
    availabilityTimeSlots,
    eventTimeSlots,
    bookings,
    items,
    forms,
    createCart,
    calculateCart,
    placeOrder,
  },
  auth: OAuthStrategy({
    clientId: "df5c40c1-a8f1-445e-bc50-c7704b2ce241",
  }),
})

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
    return media.getScaledToFillImageUrl(v, w, h, {})
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
