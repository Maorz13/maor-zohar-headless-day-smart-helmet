import { createClient, OAuthStrategy } from "@wix/sdk"
import { currentCart } from "@wix/ecom"
import { redirects } from "@wix/redirects"

import { WIX_CLIENT_ID } from "@/lib/wix"

/**
 * Cart + checkout-redirect client. Kept separate from the catalog client so
 * that pages which never touch the cart don't bundle the ecom SDK — and the
 * header only loads this module on demand (dynamic import) once the visitor
 * actually has a cart.
 */
export const wixCart = createClient({
  modules: { currentCart, redirects },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
})

/**
 * `carts/current` throws (404) for visitors who never created a cart.
 * Resolve that — and any other failure — to null instead of leaking a
 * console error.
 */
export async function getCurrentCartSafe(): Promise<
  currentCart.Cart | null
> {
  try {
    return await wixCart.currentCart.getCurrentCart()
  } catch {
    return null
  }
}
