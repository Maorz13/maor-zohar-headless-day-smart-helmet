"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { currentCart } from "@wix/ecom"
import { ArrowLeft, Loader2 } from "lucide-react"

import { AddToCartButton } from "@/components/add-to-cart-button"
import { HelmetVisual, MODEL_TAGLINES } from "@/components/helmets"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  emitCartUpdated,
  formatPrice,
  markStoredCart,
  WIX_STORES_APP_ID,
} from "@/lib/wix"
import { wixCart } from "@/lib/wix-cart"
import { wixStore } from "@/lib/wix-store"

type Product = {
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

type Variant = {
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

function variantLabel(v: Variant): string {
  const choices = v.choices ?? v.optionChoices ?? []
  const parts = choices
    .map((c) => c.optionChoiceNames)
    .filter(Boolean)
    .map((n) => n!.choiceName)
    .filter(Boolean)
  return parts.join(" · ")
}

function ProductDetail() {
  const params = useSearchParams()
  const id = params.get("id")

  const [product, setProduct] = React.useState<Product | null | undefined>(
    undefined
  )
  const [variants, setVariants] = React.useState<Variant[]>([])
  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    undefined
  )
  const [buying, setBuying] = React.useState(false)
  const [buyError, setBuyError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!id) {
      setProduct(null)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await wixStore.productsV3.queryProducts().limit(100).find()
        const found =
          (res.items as Product[]).find((p) => p._id === id) ?? null
        if (cancelled) return
        setProduct(found)
        if (found?._id) {
          try {
            const vres = await wixStore.readOnlyVariantsV3
              .queryVariants()
              .eq("productData.productId", found._id)
              .find()
            if (!cancelled) setVariants(vres.items as Variant[])
          } catch {
            // variants stay empty — buy flow will surface an error if needed
          }
        }
      } catch {
        if (!cancelled) setProduct(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const chosen =
    variants.find((v) => (v.variantId ?? v._id) === selectedId) ??
    variants.find((v) => variantLabel(v).startsWith("M")) ??
    variants[0]

  const buyNow = async () => {
    if (!product?._id) return
    setBuying(true)
    setBuyError(null)
    try {
      const variantId = chosen ? (chosen.variantId ?? chosen._id) : undefined
      await wixCart.currentCart.addToCurrentCart({
        lineItems: [
          {
            quantity: 1,
            catalogReference: {
              catalogItemId: product._id,
              appId: WIX_STORES_APP_ID,
              options: variantId ? { variantId } : undefined,
            },
          },
        ],
      })
      markStoredCart()
      emitCartUpdated()
      const checkout = await wixCart.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      })
      const origin = window.location.origin
      const session = await wixCart.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkout.checkoutId },
        callbacks: {
          postFlowUrl: `${origin}/cart`,
          thankYouPageUrl: `${origin}/`,
        },
      })
      const url = session.redirectSession?.fullUrl
      if (!url) throw new Error("no redirect url")
      window.location.href = url
    } catch {
      setBuyError("Couldn't start checkout. Please try again in a moment.")
      setBuying(false)
    }
  }

  if (product === undefined) {
    return (
      <div className="grid gap-10 md:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (product === null) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
        <h1 className="font-medium">Helmet not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This model may have moved — the full lineup is in the shop.
        </p>
        <Button className="mt-6" variant="outline" render={<Link href="/shop" />}>
          <ArrowLeft data-icon="inline-start" />
          Back to the shop
        </Button>
      </div>
    )
  }

  const price = formatPrice(
    product.actualPriceRange?.minValue?.amount,
    product.currency
  )
  const compareAt = formatPrice(
    product.compareAtPriceRange?.minValue?.amount,
    product.currency
  )
  const inStock = product.inventory?.availabilityStatus !== "OUT_OF_STOCK"
  const tagline = MODEL_TAGLINES[product.slug ?? ""]

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <HelmetVisual
        helmet={product}
        className="aspect-[4/3] w-full rounded-xl object-cover"
      />

      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold tracking-tight">
          {product.name}
        </h1>
        {tagline ? (
          <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
        ) : null}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-semibold tabular-nums">{price}</span>
          {compareAt && compareAt !== price ? (
            <span className="text-sm text-muted-foreground line-through">
              {compareAt}
            </span>
          ) : null}
        </div>
        {product.plainDescription ? (
          <p className="mt-6 leading-7 whitespace-pre-line text-muted-foreground">
            {product.plainDescription}
          </p>
        ) : null}

        {variants.length > 1 ? (
          <div className="mt-6 max-w-xs">
            <Label htmlFor="size">Size</Label>
            <Select
              value={selectedId ?? (chosen?.variantId ?? chosen?._id)}
              onValueChange={(v) => setSelectedId(v ?? undefined)}
            >
              <SelectTrigger id="size" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map((v, i) => (
                  <SelectItem
                    key={v.variantId ?? v._id ?? i}
                    value={v.variantId ?? v._id ?? ""}
                  >
                    {variantLabel(v) || `Option ${i + 1}`}
                    {v.inventoryStatus?.inStock === false
                      ? " (out of stock)"
                      : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <div className="mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
          {product._id && inStock ? (
            <AddToCartButton
              productId={product._id}
              variantId={chosen?.variantId ?? chosen?._id}
              className="flex-1"
            />
          ) : null}
          <Button
            size="default"
            variant={inStock ? "outline" : "default"}
            className="flex-1"
            disabled={buying || !inStock}
            onClick={buyNow}
          >
            {buying ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                Heading to checkout…
              </>
            ) : inStock ? (
              "Buy now"
            ) : (
              "Out of stock"
            )}
          </Button>
        </div>
        {buyError ? (
          <p className="mt-3 text-sm text-destructive">{buyError}</p>
        ) : null}
        <p className="mt-3 text-xs text-muted-foreground">
          Secure checkout via Wix. Every helmet includes the fitting and your
          printed calibration map.
        </p>
      </div>
    </div>
  )
}

export default function ProductPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the shop
      </Link>
      <div className="mt-8">
        <React.Suspense
          fallback={<Skeleton className="aspect-[4/3] max-w-md rounded-xl" />}
        >
          <ProductDetail />
        </React.Suspense>
      </div>
    </div>
  )
}
