"use client"

import * as React from "react"
import Link from "next/link"

import { AddToCartButton } from "@/components/add-to-cart-button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice, imgSrc } from "@/lib/wix"
import {
  fetchHelmets,
  variantSizeLabel,
  type Helmet,
  type HelmetVariant,
  type HelmetWithVariants,
} from "@/lib/wix-store"

export { variantSizeLabel }
export type { Helmet, HelmetVariant, HelmetWithVariants }

/** Short positioning line per model, keyed by product slug. */
export const MODEL_TAGLINES: Record<string, string> = {
  "haloride-city": "The entry model — core layers, lightest shell",
  "haloride-one": "The commuter flagship — every commuter layer",
  "haloride-pro": "The road model — radar, rear camera, 12-hour battery",
}

/**
 * The helmet lineup from Wix Stores. Renders `initial` (baked at build time)
 * immediately, then refreshes with a live fetch after mount.
 */
export function useHelmets(initial?: HelmetWithVariants[]) {
  const hadInitial = !!initial?.length
  const [helmets, setHelmets] = React.useState<HelmetWithVariants[] | null>(
    hadInitial ? (initial as HelmetWithVariants[]) : null
  )
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    fetchHelmets()
      .then((withVariants) => {
        if (!cancelled) setHelmets(withVariants)
      })
      .catch(() => {
        // Keep the baked data if we have it; only surface an error without it.
        if (!cancelled && !hadInitial) setError(true)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { helmets, error }
}

export function HelmetVisual({
  helmet,
  className,
}: {
  helmet: Helmet
  className?: string
}) {
  const src = imgSrc(helmet.media?.main, 800, 600)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={helmet.name ?? ""}
        width={800}
        height={600}
        className={className ?? "aspect-[4/3] w-full rounded-lg object-cover"}
      />
    )
  }
  return (
    <div
      className={
        className ??
        "flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-muted"
      }
    >
      <div className="text-center">
        <p className="font-mono text-4xl font-semibold text-muted-foreground/70">
          {(helmet.name ?? "HaloRide").replace("HaloRide", "").trim() || "One"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Product photo coming soon
        </p>
      </div>
    </div>
  )
}

export function HelmetCard({
  helmet,
  featured,
}: {
  helmet: HelmetWithVariants
  featured?: boolean
}) {
  const { product, variants } = helmet
  const [selected, setSelected] = React.useState<string | undefined>(undefined)
  const defaultVariant =
    variants.find((v) => variantSizeLabel(v).startsWith("M")) ?? variants[0]
  const chosen =
    variants.find((v) => (v.variantId ?? v._id) === selected) ?? defaultVariant

  const price = formatPrice(
    product.actualPriceRange?.minValue?.amount,
    product.currency
  )

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Link
          href={`/shop/product?id=${encodeURIComponent(product._id ?? "")}`}
          className="block transition-opacity hover:opacity-90"
        >
          <HelmetVisual helmet={product} />
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <CardTitle className="text-lg">
            <Link
              href={`/shop/product?id=${encodeURIComponent(product._id ?? "")}`}
              className="hover:underline hover:underline-offset-4"
            >
              {product.name}
            </Link>
          </CardTitle>
          {featured ? <Badge>Most popular</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          {MODEL_TAGLINES[product.slug ?? ""] ?? product.plainDescription}
        </p>
        <p className="mt-3 text-xl font-semibold tabular-nums">{price}</p>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        {variants.length > 1 ? (
          <Select
            value={selected ?? (defaultVariant?.variantId ?? defaultVariant?._id)}
            onValueChange={(v) => setSelected(v ?? undefined)}
          >
            <SelectTrigger aria-label="Size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => (
                <SelectItem
                  key={v.variantId ?? v._id}
                  value={v.variantId ?? v._id ?? ""}
                >
                  {variantSizeLabel(v)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {product._id ? (
          <AddToCartButton
            productId={product._id}
            variantId={chosen?.variantId ?? chosen?._id}
          />
        ) : null}
      </CardFooter>
    </Card>
  )
}

/** The three-model grid used on the home page and the shop page. */
export function HelmetsGrid({
  initialHelmets,
}: {
  initialHelmets?: HelmetWithVariants[]
}) {
  const { helmets, error } = useHelmets(initialHelmets)

  if (error) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
        Couldn&apos;t load the lineup right now — please try again in a moment.
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {helmets === null
        ? Array.from({ length: 3 }).map((_, i) => <HelmetCardSkeleton key={i} />)
        : helmets.map((h) => (
            <HelmetCard
              key={h.product._id}
              helmet={h}
              featured={h.product.slug === "haloride-one"}
            />
          ))}
    </div>
  )
}

export function HelmetCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="mt-2 flex h-7 items-center">
          <Skeleton className="h-6 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-5 w-full" />
        <div className="mt-3 flex h-7 items-center">
          <Skeleton className="h-6 w-1/4" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}
