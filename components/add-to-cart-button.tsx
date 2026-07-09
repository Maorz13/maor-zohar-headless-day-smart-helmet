"use client"

import * as React from "react"
import { Check, Loader2, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { emitCartUpdated, wix, WIX_STORES_APP_ID } from "@/lib/wix"

/**
 * Adds a product (optionally a specific variant) to the current Wix cart and
 * pings the header badge. Shows a brief "Added" confirmation state.
 */
export function AddToCartButton({
  productId,
  variantId,
  size = "default",
  variant = "default",
  className,
  label = "Add to cart",
}: {
  productId: string
  variantId?: string
  size?: "default" | "sm" | "lg"
  variant?: "default" | "outline" | "secondary"
  className?: string
  label?: string
}) {
  const [state, setState] = React.useState<"idle" | "adding" | "added">("idle")
  const [error, setError] = React.useState(false)

  const add = async () => {
    setState("adding")
    setError(false)
    try {
      await wix.currentCart.addToCurrentCart({
        lineItems: [
          {
            quantity: 1,
            catalogReference: {
              catalogItemId: productId,
              appId: WIX_STORES_APP_ID,
              options: variantId ? { variantId } : undefined,
            },
          },
        ],
      })
      emitCartUpdated()
      setState("added")
      window.setTimeout(() => setState("idle"), 2000)
    } catch {
      setError(true)
      setState("idle")
    }
  }

  return (
    <div className={className}>
      <Button
        size={size}
        variant={variant}
        className="w-full"
        disabled={state === "adding"}
        onClick={add}
      >
        {state === "adding" ? (
          <>
            <Loader2 data-icon="inline-start" className="animate-spin" />
            Adding…
          </>
        ) : state === "added" ? (
          <>
            <Check data-icon="inline-start" />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingCart data-icon="inline-start" />
            {label}
          </>
        )}
      </Button>
      {error ? (
        <p className="mt-2 text-xs text-destructive">
          Couldn&apos;t add to cart — please try again.
        </p>
      ) : null}
    </div>
  )
}
