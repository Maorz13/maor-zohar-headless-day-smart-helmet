import type { Metadata } from "next"

import { bakedHelmets } from "@/lib/baked"
import { ShopClient } from "./shop-client"

export const metadata: Metadata = {
  title: "Shop — HaloRide smart helmets",
  description:
    "Three AR smart helmet models — City, One, and Pro. Every purchase includes a printed calibration map and a studio fitting in Copenhagen.",
}

/**
 * Server page: bakes the helmet lineup from Wix Stores into the static
 * export at build time, so the grid and comparison table ship as real HTML
 * (LCP + crawlers don't wait for client JS). The client refreshes live.
 */
export default async function ShopPage() {
  const initialHelmets = await bakedHelmets()
  return <ShopClient initialHelmets={initialHelmets} />
}
