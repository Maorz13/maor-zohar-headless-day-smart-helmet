"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HelmetsGrid, useHelmets } from "@/components/helmets"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/wix"
import type { HelmetWithVariants } from "@/lib/wix-store"

/**
 * Spec sheet per model, keyed by product slug. Specs are presentation copy;
 * names and prices always come live from Wix Stores.
 */
const SPECS: { label: string; bySlug: Record<string, string> }[] = [
  {
    label: "Visor display",
    bySlug: {
      "haloride-city": "Core display",
      "haloride-one": "Full display",
      "haloride-pro": "Wide-angle display",
    },
  },
  {
    label: "Battery",
    bySlug: {
      "haloride-city": "6 hours",
      "haloride-one": "8 hours",
      "haloride-pro": "12 hours",
    },
  },
  {
    label: "Weight",
    bySlug: {
      "haloride-city": "380 g",
      "haloride-one": "440 g",
      "haloride-pro": "460 g",
    },
  },
  {
    label: "Speakers",
    bySlug: {
      "haloride-city": "Open-ear",
      "haloride-one": "Open-ear + mic",
      "haloride-pro": "Open-ear + dual mic",
    },
  },
  {
    label: "Data layers",
    bySlug: {
      "haloride-city": "Core (speed, nav, hazards)",
      "haloride-one": "All commuter layers",
      "haloride-pro": "Every layer incl. radar + rear cam",
    },
  },
  {
    label: "Sensor suite",
    bySlug: {
      "haloride-city": "—",
      "haloride-one": "Light + motion",
      "haloride-pro": "Radar + rear camera + power",
    },
  },
  {
    label: "In the box",
    bySlug: {
      "haloride-city": "Helmet + calibration map",
      "haloride-one": "Helmet + calibration map",
      "haloride-pro": "Helmet + map + second visor",
    },
  },
]

function ComparisonTable({
  initialHelmets,
}: {
  initialHelmets?: HelmetWithVariants[]
}) {
  const { helmets, error } = useHelmets(initialHelmets)

  if (error) return null
  if (helmets === null) {
    return <Skeleton className="h-96 w-full rounded-xl" />
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40" />
            {helmets.map(({ product }) => (
              <TableHead key={product._id} className="min-w-44">
                <Link
                  href={`/shop/product?id=${encodeURIComponent(product._id ?? "")}`}
                  className="font-semibold text-foreground hover:underline hover:underline-offset-4"
                >
                  {product.name}
                </Link>
                <p className="font-normal text-muted-foreground tabular-nums">
                  {formatPrice(
                    product.actualPriceRange?.minValue?.amount,
                    product.currency
                  )}
                </p>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {SPECS.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              {helmets.map(({ product }) => (
                <TableCell
                  key={product._id}
                  className="text-muted-foreground"
                >
                  {row.bySlug[product.slug ?? ""] ?? "—"}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell />
            {helmets.map(({ product }) => (
              <TableCell key={product._id}>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <Link
                      href={`/shop/product?id=${encodeURIComponent(product._id ?? "")}`}
                    />
                  }
                >
                  View details
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export function ShopClient({
  initialHelmets,
}: {
  initialHelmets?: HelmetWithVariants[]
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Three models. Pick your ride.
        </h1>
        <p className="mt-3 text-muted-foreground">
          City for the everyday, One for every commute, Pro for the long road.
          Whichever you choose, it ships with your printed calibration map —
          and every purchase includes the fitting.
        </p>
      </div>

      <div className="mt-10">
        <HelmetsGrid initialHelmets={initialHelmets} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Compare the lineup
        </h2>
        <p className="mt-2 text-muted-foreground">
          Same calibration, different reach.
        </p>
        <div className="mt-6">
          <ComparisonTable initialHelmets={initialHelmets} />
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Not sure which fits?{" "}
        <Link
          href="/contact"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Book a free demo ride
        </Link>{" "}
        and try all three at the studio.
      </p>
    </div>
  )
}
