import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { DataLayersExplorer, type DataLayer } from "@/components/data-layers"
import { Button } from "@/components/ui/button"
import { bakedLayers } from "@/lib/baked"

export const metadata: Metadata = {
  title: "Data Layers",
  description:
    "Twelve real-time AR data layers for the HaloRide helmet — navigation, hazard alerts, radar, weather, and more. Each renders at the position from your printed calibration map.",
}

export default async function LayersPage() {
  const initialLayers = await bakedLayers<DataLayer>()
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Twelve layers over the road
        </h1>
        <p className="mt-3 text-muted-foreground">
          Every layer renders on the visor at the position from your printed
          calibration map — measured from your own field of view at the
          fitting. Search by name or filter by which model carries it.
        </p>
      </div>

      <div className="mt-10">
        <DataLayersExplorer initialLayers={initialLayers} />
      </div>

      <div className="mt-16 rounded-xl border bg-muted/30 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          See the layers on a real ride
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The demo ride runs every layer live on the cycle lane outside the
          studio — 45 minutes, free, no payment until you confirm the fit.
        </p>
        <Button className="mt-5" render={<Link href="/contact" />}>
          Book a demo ride
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
