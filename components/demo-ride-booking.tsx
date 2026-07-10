"use client"

import * as React from "react"

import { BookingFlow } from "@/components/booking-flow"
import { Skeleton } from "@/components/ui/skeleton"
import { DEMO_RIDE_SERVICE_SLUG } from "@/lib/wix"
import { wixBookings } from "@/lib/wix-bookings"

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetches the demo-ride service from Wix Bookings and renders the slot
 * picker + booking form for it.
 */
export function DemoRideBooking() {
  const [service, setService] = React.useState<any | null | undefined>(
    undefined
  )

  React.useEffect(() => {
    let cancelled = false
    wixBookings.services
      .queryServices()
      .find()
      .then((res) => {
        if (cancelled) return
        const all = res.items as any[]
        const demo =
          all.find((s) => s?.mainSlug?.name === DEMO_RIDE_SERVICE_SLUG) ??
          all[0] ??
          null
        setService(demo)
      })
      .catch(() => {
        if (!cancelled) setService(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (service === undefined) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
    )
  }

  if (service === null) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
        The booking calendar is taking a breather — email us at
        hello@haloride.example and we&apos;ll find you a slot.
      </p>
    )
  }

  return <BookingFlow service={service} />
}
