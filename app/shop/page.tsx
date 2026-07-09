"use client"

import * as React from "react"
import Link from "next/link"
import { PackageOpen, ShoppingBag } from "lucide-react"

import { formatPrice, imgSrc, wix } from "@/lib/wix"

type Product = {
  _id?: string
  name?: string | null
  plainDescription?: string | null
  currency?: string | null
  actualPriceRange?: { minValue?: { amount?: string | null } | null } | null
  media?: { main?: unknown } | null
}

function ProductImage({ product }: { product: Product }) {
  const src = imgSrc(product.media?.main, 800, 800)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={product.name ?? ""}
        className="aspect-square w-full rounded-lg object-cover"
      />
    )
  }
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/40">
      <span className="font-mono text-3xl font-semibold text-muted-foreground/60">
        {(product.name ?? "?").slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    wix.productsV3
      .queryProducts()
      .limit(50)
      .find()
      .then((res) => {
        if (!cancelled) setProducts(res.items as Product[])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="font-mono text-sm text-primary">/shop</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Dev merch, shipped
        </h1>
        <p className="mt-3 text-muted-foreground">
          Gear for the terminally online. Every product below is fetched live
          from Wix Stores.
        </p>
      </div>

      <div className="mt-10">
        {error ? (
          <EmptyState
            icon={PackageOpen}
            title="Couldn't load the shop"
            body="Something went wrong fetching products. Please try again in a moment."
          />
        ) : products === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-square animate-pulse rounded-lg bg-muted/50" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted/50" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-muted/50" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="The shelves are being stocked"
            body="No products yet — new merch is on its way. Check back soon."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p._id}
                href={`/shop/product?id=${encodeURIComponent(p._id ?? "")}`}
                className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-muted/30"
              >
                <ProductImage product={p} />
                <div className="mt-4 flex items-start justify-between gap-2">
                  <h2 className="font-medium group-hover:underline group-hover:underline-offset-4">
                    {p.name}
                  </h2>
                  <span className="shrink-0 font-mono text-sm text-muted-foreground">
                    {formatPrice(
                      p.actualPriceRange?.minValue?.amount,
                      p.currency
                    )}
                  </span>
                </div>
                {p.plainDescription ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {p.plainDescription}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <Icon className="size-8 text-muted-foreground/60" />
      <h2 className="mt-4 font-medium">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  )
}
