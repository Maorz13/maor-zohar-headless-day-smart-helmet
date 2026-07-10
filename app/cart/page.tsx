"use client"

import * as React from "react"
import Link from "next/link"
import { currentCart } from "@wix/ecom"
import { ArrowRight, Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { emitCartUpdated, formatPrice, hasStoredCart, imgSrc } from "@/lib/wix"
import { getCurrentCartSafe, wixCart } from "@/lib/wix-cart"

/* eslint-disable @typescript-eslint/no-explicit-any */

type Cart = {
  _id?: string
  currency?: string
  lineItems?: any[]
  subtotal?: { amount?: string; formattedAmount?: string }
}

function lineDescription(li: any): string {
  return ((li.descriptionLines ?? []) as any[])
    .map((d) => d?.plainText?.original ?? d?.colorInfo?.original)
    .filter(Boolean)
    .join(" · ")
}

export default function CartPage() {
  const [cart, setCart] = React.useState<Cart | null | undefined>(undefined)
  const [busyLine, setBusyLine] = React.useState<string | null>(null)
  const [checkingOut, setCheckingOut] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    // A fresh visitor has no cart — render the empty state without hitting
    // `carts/current` (it 404s and logs a console error).
    if (!hasStoredCart()) {
      setCart(null)
      return
    }
    const c = await getCurrentCartSafe()
    setCart((c as Cart) ?? null)
  }, [])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  const setQuantity = async (lineId: string, quantity: number) => {
    setBusyLine(lineId)
    setError(null)
    try {
      if (quantity < 1) {
        await wixCart.currentCart.removeLineItemsFromCurrentCart([lineId])
      } else {
        await wixCart.currentCart.updateCurrentCartLineItemQuantity([
          { _id: lineId, quantity },
        ])
      }
      emitCartUpdated()
      await refresh()
    } catch {
      setError("Couldn't update the cart — please try again.")
    } finally {
      setBusyLine(null)
    }
  }

  const checkout = async () => {
    setCheckingOut(true)
    setError(null)
    try {
      const co = await wixCart.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      })
      const origin = window.location.origin
      const session = await wixCart.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: co.checkoutId },
        callbacks: {
          postFlowUrl: `${origin}/cart`,
          thankYouPageUrl: `${origin}/`,
        },
      })
      const url = session.redirectSession?.fullUrl
      if (!url) throw new Error("no redirect url")
      window.location.href = url
    } catch {
      setError("Couldn't start checkout. Please try again in a moment.")
      setCheckingOut(false)
    }
  }

  const items = cart?.lineItems ?? []
  const isEmpty = cart !== undefined && items.length === 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Your cart
      </h1>
      <p className="mt-2 text-muted-foreground">
        Every helmet includes the fitting and your printed calibration map.
      </p>

      <div className="mt-10">
        {cart === undefined ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
            <ShoppingCart className="size-8 text-muted-foreground/60" />
            <h2 className="mt-4 font-medium">Your cart is empty</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Three models are waiting in the shop — or try them all on a free
              demo ride first.
            </p>
            <div className="mt-6 flex gap-2">
              <Button render={<Link href="/shop" />}>
                Shop the lineup
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button variant="outline" render={<Link href="/contact" />}>
                Book a demo ride
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((li) => {
                const img = imgSrc(li.image, 200, 200)
                const busy = busyLine === li._id
                return (
                  <Card key={li._id}>
                    <CardContent className="flex items-center gap-4">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img}
                          alt={li.productName?.original ?? ""}
                          className="size-20 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <ShoppingCart className="size-6 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">
                          {li.productName?.original}
                        </p>
                        {lineDescription(li) ? (
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {lineDescription(li)}
                          </p>
                        ) : null}
                        <p className="mt-1 text-sm tabular-nums">
                          {li.price?.formattedAmount ??
                            formatPrice(li.price?.amount, cart?.currency)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label="Decrease quantity"
                          disabled={busy}
                          onClick={() =>
                            setQuantity(li._id, (li.quantity ?? 1) - 1)
                          }
                        >
                          <Minus />
                        </Button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {busy ? (
                            <Loader2 className="mx-auto size-3.5 animate-spin" />
                          ) : (
                            li.quantity
                          )}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          aria-label="Increase quantity"
                          disabled={busy}
                          onClick={() =>
                            setQuantity(li._id, (li.quantity ?? 1) + 1)
                          }
                        >
                          <Plus />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${li.productName?.original ?? "item"}`}
                        disabled={busy}
                        onClick={() => setQuantity(li._id, 0)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium tabular-nums">
                    {cart?.subtotal?.formattedAmount ??
                      formatPrice(cart?.subtotal?.amount, cart?.currency)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Shipping and taxes are calculated at checkout.
                </p>
                <Separator className="my-4" />
                <Button
                  size="lg"
                  className="w-full"
                  disabled={checkingOut}
                  onClick={checkout}
                >
                  {checkingOut ? (
                    <>
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                      Heading to checkout…
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight data-icon="inline-end" />
                    </>
                  )}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  You&apos;ll complete your purchase on our secure Wix checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}
