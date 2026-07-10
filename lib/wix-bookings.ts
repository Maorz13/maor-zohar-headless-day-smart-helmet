import { createClient, OAuthStrategy } from "@wix/sdk"
import {
  services,
  availabilityTimeSlots,
  eventTimeSlots,
  bookings,
} from "@wix/bookings"
import { forms } from "@wix/forms"
import { redirects } from "@wix/redirects"
import {
  createCart,
  calculateCart,
  placeOrder,
} from "@wix/auto_sdk_ecom_cart-v-2"

import { WIX_CLIENT_ID } from "@/lib/wix"

/**
 * Bookings client — services, availability, booking creation, the booking
 * form schema, and the ecom Cart V2 bits the booking checkout needs. Only
 * the contact page's booking flow bundles this.
 */
export const wixBookings = createClient({
  modules: {
    services,
    availabilityTimeSlots,
    eventTimeSlots,
    bookings,
    forms,
    redirects,
    createCart,
    calculateCart,
    placeOrder,
  },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
})
