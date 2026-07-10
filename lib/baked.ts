import {
  DATA_LAYERS_COLLECTION_ID,
  FAQ_COLLECTION_ID,
  TESTIMONIALS_COLLECTION_ID,
} from "@/lib/wix"
import { fetchCollectionItems } from "@/lib/wix-data"
import { fetchHelmets, type HelmetWithVariants } from "@/lib/wix-store"

/**
 * Build-time content baking. Server components call these during
 * `next build` (output: "export") so the static HTML ships with real
 * products / CMS content — LCP and crawlers no longer wait for client JS.
 * The client components then refresh with a live fetch after mount.
 *
 * Every fetch is fail-open: if Wix is unreachable at build time the build
 * still succeeds and the client components fall back to skeleton + live
 * fetch, exactly as before.
 */
async function bake<T>(label: string, fn: () => Promise<T>, fallback: T) {
  try {
    // Round-trip through JSON so only plain serializable data crosses the
    // server → client component boundary.
    return JSON.parse(JSON.stringify(await fn())) as T
  } catch (err) {
    console.warn(
      `[bake] ${label}: build-time fetch failed — exporting without baked data.`,
      err instanceof Error ? err.message : err
    )
    return fallback
  }
}

export function bakedHelmets(): Promise<HelmetWithVariants[]> {
  return bake("helmets", fetchHelmets, [])
}

export function bakedCollection<T>(collectionId: string): Promise<T[]> {
  return bake(collectionId, () => fetchCollectionItems<T>(collectionId), [])
}

export const bakedLayers = <T>() => bakedCollection<T>(DATA_LAYERS_COLLECTION_ID)
export const bakedFaqs = <T>() => bakedCollection<T>(FAQ_COLLECTION_ID)
export const bakedTestimonials = <T>() =>
  bakedCollection<T>(TESTIMONIALS_COLLECTION_ID)
