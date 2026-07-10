"use client"

import * as React from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  formatPrice,
  STAFF_MEMBER_RESOURCE_TYPE_ID,
  WIX_BOOKINGS_APP_ID,
} from "@/lib/wix"
import { wixBookings } from "@/lib/wix-bookings"

/* eslint-disable @typescript-eslint/no-explicit-any */

type Slot = {
  localStartDate?: string | null
  localEndDate?: string | null
  scheduleId?: string | null
  eventInfo?: { eventId?: string | null } | null
}

type FormField = {
  target: string
  label: string
  type: string
  options?: { label?: string; value?: string }[]
}

const FALLBACK_FIELDS: FormField[] = [
  { target: "first_name", label: "First name", type: "STRING" },
  { target: "last_name", label: "Last name", type: "STRING" },
  { target: "email", label: "Email", type: "EMAIL" },
]

const SIMPLE_TYPES = ["STRING", "EMAIL", "PHONE", "NUMBER", "URL"]

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function localDateString(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function slotTime(s?: string | null) {
  if (!s) return ""
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
}

function slotDay(s?: string | null) {
  if (!s) return ""
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function inputType(t: string) {
  switch (t) {
    case "EMAIL":
      return "email"
    case "PHONE":
      return "tel"
    case "NUMBER":
      return "number"
    case "URL":
      return "url"
    default:
      return "text"
  }
}

export function BookingFlow({ service }: { service: any }) {
  const [slots, setSlots] = React.useState<Slot[] | null>(null)
  const [slotsError, setSlotsError] = React.useState(false)
  const [selected, setSelected] = React.useState<Slot | null>(null)
  const [fields, setFields] = React.useState<FormField[]>(FALLBACK_FIELDS)
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [booking, setBooking] = React.useState(false)
  const [bookError, setBookError] = React.useState<string | null>(null)
  const [confirmed, setConfirmed] = React.useState(false)

  const isClass = service?.type === "CLASS"

  React.useEffect(() => {
    let cancelled = false
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const now = new Date()
    const to = new Date(now)
    to.setDate(to.getDate() + 14)
    const fromLocalDate = localDateString(now)
    const toLocalDate = localDateString(to)

    ;(async () => {
      try {
        let timeSlots: Slot[] = []
        if (isClass) {
          const res = await wixBookings.eventTimeSlots.listEventTimeSlots({
            serviceIds: [service._id],
            fromLocalDate,
            toLocalDate,
            timeZone,
            includeNonBookable: false,
          } as any)
          timeSlots = (res.timeSlots ?? []) as Slot[]
        } else {
          const res = await wixBookings.availabilityTimeSlots.listAvailabilityTimeSlots(
            {
              serviceId: service._id,
              fromLocalDate,
              toLocalDate,
              timeZone,
              bookable: true,
              cursorPaging: { limit: 100 },
            } as any
          )
          timeSlots = (res.timeSlots ?? []) as Slot[]
        }
        if (!cancelled) setSlots(timeSlots)
      } catch {
        if (!cancelled) setSlotsError(true)
      }

      // Booking form schema (flat summary) — fall back to contact basics.
      try {
        const formId = service?.form?._id
        if (formId) {
          const { formSummary } = await wixBookings.forms.getFormSummary(formId)
          const parsed = ((formSummary?.fields ?? []) as any[])
            .filter((f) => !f.deleted)
            .filter((f) => f.type && SIMPLE_TYPES.includes(f.type))
            .map((f) => ({
              target: f.target as string,
              label: (f.label as string) || (f.target as string),
              type: f.type as string,
              options: f.options as FormField["options"],
            }))
            .filter((f) => f.target)
          if (!cancelled && parsed.length) setFields(parsed)
        }
      } catch {
        // keep the fallback fields
      }
    })()

    return () => {
      cancelled = true
    }
  }, [service, isClass])

  const grouped = React.useMemo(() => {
    const byDay = new Map<string, Slot[]>()
    for (const s of slots ?? []) {
      const key = (s.localStartDate ?? "").slice(0, 10)
      if (!key) continue
      const list = byDay.get(key) ?? []
      list.push(s)
      byDay.set(key, list)
    }
    return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [slots])

  const book = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setBooking(true)
    setBookError(null)
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

      // Derive the payment option from the service (never hardcode ONLINE).
      const online = !!service?.payment?.options?.online
      const inPerson = !!service?.payment?.options?.inPerson
      const selectedPaymentOption =
        online && !inPerson ? "ONLINE" : !online && inPerson ? "OFFLINE" : "ONLINE"

      const slot: Record<string, unknown> = {
        serviceId: service._id,
        startDate: selected.localStartDate,
        endDate: selected.localEndDate,
        timezone: timeZone,
        location: { locationType: "OWNER_BUSINESS" },
      }
      if (isClass) {
        slot.eventId = selected.eventInfo?.eventId
      } else {
        slot.scheduleId = selected.scheduleId ?? undefined
        slot.resourceSelections = [
          {
            resourceTypeId: STAFF_MEMBER_RESOURCE_TYPE_ID,
            selectionMethod: "ANY_RESOURCE",
          },
        ]
      }

      const created = await wixBookings.bookings.createBooking(
        {
          selectedPaymentOption,
          totalParticipants: 1,
          bookedEntity: { slot },
        } as any,
        { formSubmission: values } as any
      )
      const bookingId = (created as any)?.booking?._id
      if (!bookingId) throw new Error("booking failed")

      // The ecom Cart V2 holds the seat.
      const cart = await wixBookings.createCart({
        catalogItems: [
          {
            quantity: 1,
            catalogReference: {
              catalogItemId: bookingId,
              appId: WIX_BOOKINGS_APP_ID,
            },
          },
        ],
        cart: { source: { channelType: "WEB" } },
      } as any)
      const cartId = (cart as any)?._id
      if (!cartId) throw new Error("cart creation failed")

      const { summary } = await wixBookings.calculateCart(cartId)
      const total = Number(
        (summary as any)?.priceSummary?.total?.amount ?? "0"
      )
      const feePolicy =
        !!service?.bookingPolicy?.cancellationFeePolicy?.enabled
      const checkoutRequired = feePolicy
        ? true
        : total === 0
          ? false
          : selectedPaymentOption !== "OFFLINE"

      if (checkoutRequired) {
        const { redirectSession } = await wixBookings.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: cartId },
          callbacks: { postFlowUrl: `${window.location.origin}/contact` },
        })
        const url = redirectSession?.fullUrl
        if (!url) throw new Error("no redirect url")
        window.location.href = url
        return
      }

      await wixBookings.placeOrder(cartId)
      setConfirmed(true)
    } catch {
      setBookError(
        "We couldn't complete that booking — the slot may have just been taken. Please pick another time and try again."
      )
    } finally {
      setBooking(false)
    }
  }

  if (confirmed) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <p className="font-medium">Booking confirmed!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {service?.name} — {slotDay(selected?.localStartDate)} at{" "}
            {slotTime(selected?.localStartDate)}. We&apos;ve saved your spot; a
            confirmation email is on its way.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Slot picker */}
      <div>
        <h4 className="text-sm font-medium">Pick a time</h4>
        {slotsError ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Couldn&apos;t load availability right now. Please try again in a
            moment.
          </p>
        ) : slots === null ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 animate-pulse rounded-full bg-muted/50"
              />
            ))}
          </div>
        ) : grouped.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No open slots in the next two weeks — check back soon.
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {grouped.slice(0, 7).map(([day, daySlots]) => (
              <div key={day}>
                <p className="font-mono text-xs text-muted-foreground">
                  {slotDay(daySlots[0]?.localStartDate)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {daySlots.slice(0, 12).map((s, i) => {
                    const isSelected =
                      selected?.localStartDate === s.localStartDate &&
                      selected?.scheduleId === s.scheduleId
                    return (
                      <button
                        key={`${s.localStartDate}-${i}`}
                        type="button"
                        onClick={() => setSelected(s)}
                        className={
                          isSelected
                            ? "rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                            : "rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-muted/50"
                        }
                      >
                        {slotTime(s.localStartDate)}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details form */}
      {selected ? (
        <form onSubmit={book} className="space-y-4">
          <h4 className="text-sm font-medium">Your details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.target}
                className={f.type === "EMAIL" ? "sm:col-span-2" : undefined}
              >
                <label
                  htmlFor={`bf-${service?._id}-${f.target}`}
                  className="text-sm text-muted-foreground"
                >
                  {f.label}
                </label>
                {f.options?.length ? (
                  <select
                    id={`bf-${service?._id}-${f.target}`}
                    value={values[f.target] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.target]: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select…</option>
                    {f.options.map((o, i) => (
                      <option key={i} value={o.value ?? o.label ?? ""}>
                        {o.label ?? o.value}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`bf-${service?._id}-${f.target}`}
                    type={inputType(f.type)}
                    required={["first_name", "last_name", "email"].includes(
                      f.target
                    )}
                    value={values[f.target] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.target]: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={booking}>
              {booking ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Booking…
                </>
              ) : (
                <>
                  Book {slotDay(selected.localStartDate)} at{" "}
                  {slotTime(selected.localStartDate)}
                </>
              )}
            </Button>
            {service?.payment?.fixed?.price?.value &&
            Number(service.payment.fixed.price.value) > 0 ? (
              <span className="text-xs text-muted-foreground">
                {formatPrice(
                  service.payment.fixed.price.value,
                  service.payment.fixed.price.currency
                )}{" "}
                — you&apos;ll pay on our secure Wix checkout.
              </span>
            ) : null}
          </div>
          {bookError ? (
            <p className="text-sm text-destructive">{bookError}</p>
          ) : null}
        </form>
      ) : null}
    </div>
  )
}
