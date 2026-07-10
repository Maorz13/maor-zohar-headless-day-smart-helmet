import type { Metadata } from "next"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

import { DemoRideBooking } from "@/components/demo-ride-booking"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BUSINESS } from "@/lib/wix"

export const metadata: Metadata = {
  title: "Book a demo ride",
  description:
    "Book a free 45-minute demo ride at the HaloRide studio in Copenhagen — fitting, HUD calibration, and a ride on the cycle lane. No payment until you confirm the fit.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Book a demo ride
        </h1>
        <p className="mt-3 text-muted-foreground">
          45 minutes at the studio: fitting, calibration measured from your own
          field of view, and a ride on the cycle lane outside. It&apos;s free —
          no payment is taken until you confirm the fitted helmet afterwards.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader>
            <CardTitle>Pick a slot</CardTitle>
            <CardDescription>
              Most riders book 3–7 days ahead; same-day slots appear when the
              calendar allows it. You&apos;ll get a confirmation email with an
              edit link for changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemoRideBooking />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>The studio</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    {BUSINESS.street}, {BUSINESS.city}, {BUSINESS.country}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{BUSINESS.hours}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="hover:underline hover:underline-offset-4"
                  >
                    {BUSINESS.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <a
                    href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
                    className="hover:underline hover:underline-offset-4"
                  >
                    {BUSINESS.phone}
                  </a>
                </li>
              </ul>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                Bring your bike if you can — calibration on your own riding
                position beats the studio loaner. Helmets and rain gear are on
                hand either way.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Good to know</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>· All three models are available to try at every demo</li>
                <li>· Prescription glasses fit under every visor</li>
                <li>
                  · Accessibility notes? Add them to the booking form and
                  we&apos;ll prepare
                </li>
                <li>
                  · Follow along on{" "}
                  <a
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Instagram
                  </a>{" "}
                  and{" "}
                  <a
                    href={BUSINESS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
