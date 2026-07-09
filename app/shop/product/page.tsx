"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { currentCart } from "@wix/ecom"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatPrice, imgSrc, wix, WIX_STORES_APP_ID } from "@/lib/wix"

type Product = {
  _id?: string
  name?: string | null
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
  optionChoices?: {
    optionChoiceNames?: { optionName?: string; choiceName?: string } | null
  }[]
  inventoryStatus?: { inStock?: boolean | null } | null
}

function variantLabel(v: Variant): string {
  const parts = (v.optionChoices ?? [])
    .map((c) => c.optionChoiceNames)
    .filter(Boolean)
    .map((n) => `${n!.optionName}: ${n!.choiceName}`)
  return parts.join(" · ")
}

function ProductDetail() {
  const params = useSearchParams()
  const id = params.get("id")

  const [product, setProduct] = React.useState<Product | null | undefined>(
    undefined
  )
  const [variants, setVariants] = React.useState<Variant[]>([])
  const [selectedVariant, setSelectedVariant] = React.useState(0)
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
        const res = await wix.productsV3.queryProducts().limit(100).find()
        const found =
          (res.items as Product[]).find((p) => p._id === id) ?? null
        if (cancelled) return
        setProduct(found)
        if (found?._id) {
          try {
            const vres = await wix.readOnlyVariantsV3
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

  const buyNow = async () => {
    if (!product?._id) return
    setBuying(true)
    setBuyError(null)
    try {
      const chosen = variants[selectedVariant] ?? variants[0]
      const variantId = chosen ? (chosen.variantId ?? chosen._id) : undefined
      await wix.currentCart.addToCurrentCart({
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
      const checkout = await wix.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      })
      const origin = window.location.origin
      const session = await wix.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkout.checkoutId },
        callbacks: { postFlowUrl: `${origin}/shop`, thankYouPageUrl: `${origin}/shop` },
      })
      const url = session.redirectSession?.fullUrl
      if (!url) throw new Error("no redirect url")
      window.location.href = url
    } catch {
      setBuyError(
        "Couldn't start checkout. Please try again in a moment."
      )
      setBuying(false)
    }
  }

  if (product === undefined) {
    return (
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-muted/50" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted/50" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-muted/50" />
          <div className="h-24 w-full animate-pulse rounded bg-muted/50" />
        </div>
      </div>
    )
  }

  if (product === null) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <h1 className="font-medium">Product not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This product may still be on its way to the shelves.
        </p>
        <Button className="mt-6" variant="outline" render={<Link href="/shop" />}>
          <ArrowLeft data-icon="inline-start" />
          Back to shop
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
  const imageSrc = imgSrc(product.media?.main, 1000, 1000)

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={product.name ?? ""}
          className="aspect-square w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/40">
          <span className="font-mono text-6xl font-semibold text-muted-foreground/50">
            {(product.name ?? "?").slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}

      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold tracking-tight">
          {product.name}
        </h1>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-mono text-xl">{price}</span>
          {compareAt && compareAt !== price ? (
            <span className="font-mono text-sm text-muted-foreground line-through">
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
          <div className="mt-6">
            <label
              htmlFor="variant"
              className="text-sm font-medium text-foreground"
            >
              Options
            </label>
            <select
              id="variant"
              value={selectedVariant}
              onChange={(e) => setSelectedVariant(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {variants.map((v, i) => (
                <option key={v.variantId ?? v._id ?? i} value={i}>
                  {variantLabel(v) || `Option ${i + 1}`}
                  {v.inventoryStatus?.inStock === false
                    ? " (out of stock)"
                    : ""}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="mt-8">
          <Button
            size="lg"
            className="w-full sm:w-auto"
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
          {buyError ? (
            <p className="mt-3 text-sm text-destructive">{buyError}</p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            You&apos;ll complete your purchase on our secure Wix checkout.
          </p>
        </div>
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
        Back to shop
      </Link>
      <div className="mt-8">
        <React.Suspense
          fallback={
            <div className="aspect-square max-w-md animate-pulse rounded-xl bg-muted/50" />
          }
        >
          <ProductDetail />
        </React.Suspense>
      </div>
    </div>
  )
}
