import { createClient, OAuthStrategy } from "@wix/sdk"
import { items } from "@wix/data"

import { WIX_CLIENT_ID } from "@/lib/wix"

/**
 * Wix Data (CMS collections) client — FAQs, DataLayers, Testimonials.
 * Isomorphic: client components refresh live data with it in the browser and
 * the home/layers pages call `fetchCollectionItems` at build time to bake
 * the collections into the static export.
 */
export const wixData = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
})

/**
 * Query a CMS collection ordered by its `order` field. Throws on failure —
 * callers decide between error UI (client) and empty initial data (build).
 */
export async function fetchCollectionItems<T>(
  collectionId: string,
  limit = 50
): Promise<T[]> {
  const res = await wixData.items
    .query(collectionId)
    .ascending("order")
    .limit(limit)
    .find()
  return res.items as T[]
}
