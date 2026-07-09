"use client"

import * as React from "react"
import { CalendarDays, Clock } from "lucide-react"

import { BookingFlow } from "@/components/booking-flow"
import { Button } from "@/components/ui/button"
import { formatPrice, wix, WIX_BOOKINGS_APP_ID } from "@/lib/wix"

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function BookingsPage() {
  const [services, setServices] = React.useState<any[] | null>(null)
  const [error, setError] = React.useState(false)
  const [openId, setOpenId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    wix.services
      .queryServices({ conditionalFields: ["STAFF_MEMBER_DETAILS"] })
      .eq("appId", WIX_BOOKINGS_APP_ID)
      .limit(100)
      .find()
      .then((res: { items: unknown[] }) => {
        if (!cancelled)
          setServices((res.items as any[]).filter((s) => !s.hidden))
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-mono text-sm text-primary">/bookings</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Book a consulting session
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        1:1 time with our engineers — architecture reviews, migration planning,
        and hands-on unblocking. Availability is fetched live from Wix
        Bookings.
      </p>

      <div className="mt-10">
        {error ? (
          <EmptyState
            title="Couldn't load services"
            body="Something went wrong fetching our sessions. Please try again in a moment."
          />
        ) : services === null ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            title="No sessions yet"
            body="Our calendar is being set up — bookable sessions are coming soon."
          />
        ) : (
          <div className="space-y-6">
            {services.map((s) => {
              const duration =
                s.schedule?.availabilityConstraints?.sessionDurations?.[0]
              const priceValue = s.payment?.fixed?.price?.value
              const price =
                priceValue && Number(priceValue) > 0
                  ? formatPrice(priceValue, s.payment?.fixed?.price?.currency)
                  : "Free"
              const isOpen = openId === s._id
              return (
                <div
                  key={s._id}
                  className="rounded-xl border border-border/60 bg-card p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold tracking-tight">
                        {s.name}
                      </h2>
                      {s.tagLine ? (
                        <p className="mt-1 text-sm text-primary">{s.tagLine}</p>
                      ) : null}
                      {s.description ? (
                        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                          {s.description}
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {duration ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-4" />
                            {duration} min
                          </span>
                        ) : null}
                        <span className="font-mono">{price}</span>
                      </div>
                    </div>
                    <Button
                      variant={isOpen ? "outline" : "default"}
                      onClick={() => setOpenId(isOpen ? null : s._id)}
                    >
                      <CalendarDays data-icon="inline-start" />
                      {isOpen ? "Close" : "Book now"}
                    </Button>
                  </div>
                  {isOpen ? (
                    <div className="mt-6 border-t border-border/60 pt-6">
                      <BookingFlow service={s} />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <CalendarDays className="size-8 text-muted-foreground/60" />
      <h2 className="mt-4 font-medium">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  )
}
