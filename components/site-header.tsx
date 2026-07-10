"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bike, Menu, ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { hasStoredCart } from "@/lib/wix"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/layers", label: "Data Layers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

function useCartCount() {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    let cancelled = false
    const refresh = () => {
      // Fresh visitors have no cart: `carts/current` would 404 (a console
      // error on every page) — skip the network call AND the ecom SDK chunk
      // until the first successful add-to-cart sets the flag.
      if (!hasStoredCart()) {
        setCount(0)
        return
      }
      import("@/lib/wix-cart")
        .then(({ getCurrentCartSafe }) => getCurrentCartSafe())
        .then((cart) => {
          if (cancelled) return
          const total = (cart?.lineItems ?? []).reduce(
            (sum, li) => sum + (li.quantity ?? 0),
            0
          )
          setCount(total)
        })
        .catch(() => {
          if (!cancelled) setCount(0)
        })
    }
    refresh()
    window.addEventListener("haloride:cart-updated", refresh)
    return () => {
      cancelled = true
      window.removeEventListener("haloride:cart-updated", refresh)
    }
  }, [])

  return count
}

export function SiteHeader() {
  const pathname = usePathname()
  const cartCount = useCartCount()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Bike className="size-4" />
          </span>
          <span className="tracking-tight">HaloRide</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                isActive(link.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative"
            render={<Link href="/cart" />}
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 ? (
              <Badge className="absolute -top-1 -right-1 size-4 min-w-4 rounded-full px-0.5 text-[10px] tabular-nums">
                {cartCount > 9 ? "9+" : cartCount}
              </Badge>
            ) : null}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>HaloRide</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive(link.href)
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
