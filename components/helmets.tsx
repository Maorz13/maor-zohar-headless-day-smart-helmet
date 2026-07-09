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
import { formatPrice, imgSrc, wix } from "@/lib/wix"

export type Helmet = {
  _id?: string
  name?: string | null
  slug?: string | null
  plainDescription?: string | null
  currency?: string | null
  actualPriceRange?: { minValue?: { amount?: string | null } | null } | null
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

/** Short positioning line per model, keyed by product slug. */
export const MODEL_TAGLINES: Record<string, string> = {
  "haloride-city": "The entry model — core layers, lightest shell",
  "haloride-one": "The commuter flagship — every commuter layer",
  "haloride-pro": "The road model — radar, rear camera, 12-hour battery",
}

export function variantSizeLabel(v: HelmetVariant): string {
  const choices = v.choices ?? v.optionChoices ?? []
  const names = choices
    .map((c) => c.optionChoiceNames?.choiceName)
    .filter(Boolean)
  return names.join(" · ") || "One size"
}

/** Fetch the three helmet models and their size variants from Wix Stores. */
export function useHelmets() {
  const [helmets, setHelmets] = React.useState<HelmetWithVariants[] | null>(
    null
  )
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await wix.productsV3.queryProducts().limit(10).find()
        const products = (res.items as Helmet[]).slice()
        products.sort(
          (a, b) =>
            MODEL_ORDER.indexOf(a.slug ?? "") - MODEL_ORDER.indexOf(b.slug ?? "")
        )
        const withVariants = await Promise.all(
          products.map(async (product) => {
            try {
              const vres = await wix.readOnlyVariantsV3
                .queryVariants()
                .eq("productData.productId", product._id)
                .find()
              return { product, variants: vres.items as HelmetVariant[] }
            } catch {
              return { product, variants: [] }
            }
          })
        )
        if (!cancelled) setHelmets(withVariants)
      } catch {
        if (!cancelled) setError(true)
      }
    })()
    return () => {
      cancelled = true
    }
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
        <p className="font-mono text-4xl font-semibold text-muted-foreground/50">
          {(helmet.name ?? "HaloRide").replace("HaloRide", "").trim() || "One"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
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
export function HelmetsGrid() {
  const { helmets, error } = useHelmets()

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
    <Card>
      <CardHeader>
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="mt-2 h-6 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-3 h-7 w-1/4" />
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  )
}
