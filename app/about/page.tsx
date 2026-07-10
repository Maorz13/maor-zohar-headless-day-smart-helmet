import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Eye, Printer, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BUSINESS } from "@/lib/wix"

export const metadata: Metadata = {
  title: "About",
  description:
    "HaloRide is an AR smart bicycle helmet studio in Copenhagen. The story of the printed calibration map — and why every layer sits where your eyes already look.",
}

const timeline = [
  {
    year: "2024",
    text: "HaloRide starts as a workbench in a Nørrebro bike kitchen — a visor display taped to a commuter helmet and a notebook full of eye-position sketches.",
  },
  {
    year: "2025",
    text: "The first fitting rig is built. We learn that no two riders rest their eyes on the same patch of road, and the calibration map becomes the product's spine.",
  },
  {
    year: "2026",
    text: "The studio opens at 14 Cykelgade with three models, twelve layers, and a printer by the fitting rig. Every helmet leaves with its rider's map in the box.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Built in Copenhagen, calibrated to you
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          HaloRide exists because of one stubborn observation: heads-up
          displays fail cyclists when they put data where the designer looked,
          not where the rider looks. So we measure. At every fitting we track
          where your eyes actually rest on the road, position each layer
          around that, and print the result — your calibration map — to pack
          in the box with the helmet.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {timeline.map((t) => (
          <Card key={t.year}>
            <CardContent>
              <p className="font-mono text-sm text-muted-foreground">
                {t.year}
              </p>
              <p className="mt-2 text-sm leading-6">{t.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Why the map matters
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A HUD that interrupts your line of sight is worse than no HUD at
            all. The map is our promise that it never will: navigation sits
            center-high where glances are cheap, speed lives low in your
            periphery, and hazard arcs only enter the frame when something is
            actually closing in.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Ruler className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Measured at the fitting rig, then verified on a real ride
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Printer className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Printed and packed with the helmet — and stored in your profile
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Re-calibrated free whenever your riding position changes
              </span>
            </li>
          </ul>
        </div>
        <Card>
          <CardContent>
            <blockquote className="text-lg leading-8">
              “We don't ask where you want the data. We measure where your
              eyes already go, and put it just outside.”
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              — the fitting team at {BUSINESS.street}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 rounded-xl border bg-muted/30 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold tracking-tight">
          Read enough? Ride it.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The story is better on the cycle lane. Book a free 45-minute demo
          ride at the studio.
        </p>
        <Button className="mt-5" render={<Link href="/contact" />}>
          Book a demo ride
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}
