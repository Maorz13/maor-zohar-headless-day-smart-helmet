import { createClient, OAuthStrategy } from "@wix/sdk"
import { productsV3, readOnlyVariantsV3 } from "@wix/stores"

import { WIX_CLIENT_ID } from "@/lib/wix"

/**
 * Catalog (Wix Stores) client — products + variants only. Cart/checkout live
 * in lib/wix-cart.ts. This module is isomorphic: client components use it in
 * the browser and the shop/home pages call `fetchHelmets` at build time to
 * bake real product HTML into the static export.
 */
export const wixStore = createClient({
  modules: { productsV3, readOnlyVariantsV3 },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
})

export type Helmet = {
  _id?: string
  name?: string | null
  slug?: string | null
  plainDescription?: string | null
  currency?: string | null
  actualPriceRange?: { minValue?: { amount?: string | null } | null } | null
  compareAtPriceRange?: {
    minValue?: { amount?: string | null } | null
  } | null
  inventory?: { availabilityStatus?: string | null } | null
  media?: { main?: unknown } | null
}

export type HelmetVariant = {
  _id?: string
  variantId?: string
  choices?: {
    optionChoiceNames?: { optionName?: string; choiceName?: string } | null
  }[]
  optionChoices?: {
    optionChoiceNames?: { optionName?: string; choiceName?: string } | null
  }[]
  inventoryStatus?: { inStock?: boolean | null } | null
}

export type HelmetWithVariants = { product: Helmet; variants: HelmetVariant[] }

/** Display order: entry model first, flagship in the middle, road model last. */
const MODEL_ORDER = ["haloride-city", "haloride-one", "haloride-pro"]

export function variantSizeLabel(v: HelmetVariant): string {
  const choices = v.choices ?? v.optionChoices ?? []
  const names = choices
    .map((c) => c.optionChoiceNames?.choiceName)
    .filter(Boolean)
  return names.join(" · ") || "One size"
}

/**
 * Fetch the helmet lineup (products + size variants), sorted for display.
 * Throws on failure — callers decide between error UI (client) and an empty
 * initial payload (build time).
 */
export async function fetchHelmets(): Promise<HelmetWithVariants[]> {
  const res = await wixStore.productsV3.queryProducts().limit(10).find()
  const products = (res.items as Helmet[]).slice()
  products.sort(
    (a, b) =>
      MODEL_ORDER.indexOf(a.slug ?? "") - MODEL_ORDER.indexOf(b.slug ?? "")
  )
  const sizeRank = (v: HelmetVariant) =>
    ["S", "M", "L"].findIndex((s) => variantSizeLabel(v).startsWith(s))
  return Promise.all(
    products.map(async (product) => {
      try {
        const vres = await wixStore.readOnlyVariantsV3
          .queryVariants()
          .eq("productData.productId", product._id)
          .find()
        const variants = (vres.items as HelmetVariant[])
          .slice()
          .sort((a, b) => sizeRank(a) - sizeRank(b))
        return { product, variants }
      } catch {
        return { product, variants: [] }
      }
    })
  )
}
