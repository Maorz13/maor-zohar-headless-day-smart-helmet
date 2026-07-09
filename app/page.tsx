import Link from "next/link"
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  Printer,
  Ruler,
  ShieldCheck,
} from "lucide-react"

import { DataLayersPreview } from "@/components/data-layers"
import { FaqSection } from "@/components/faq-section"
import { HelmetsGrid } from "@/components/helmets"
import { HelmetViewer } from "@/components/helmet-viewer"
import { StickyCta } from "@/components/sticky-cta"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BUSINESS } from "@/lib/wix"

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: BUSINESS.name,
  description:
    "AR smart bicycle helmet studio in Copenhagen. Three helmet models with a built-in visor display and speakers; every helmet ships with a printed calibration map of the rider's own field of view.",
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: "Copenhagen",
    postalCode: "2200",
    addressCountry: "DK",
  },
  openingHours: "Tu-Sa 10:00-18:00",
  priceRange: "$$$",
  sameAs: [BUSINESS.instagram, BUSINESS.tiktok],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />

      {/* 1 · Hero — split: 3D model + title + CTAs */}
      <section id="hero" className="border-b">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="secondary">
              Copenhagen · AR cycling since 2024
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              An AR cycling helmet built around one unforgettable detail
            </h1>
            <p className="mt-5 max-w-lg text-lg text-pretty text-muted-foreground">
              Speed, navigation, and hazard alerts appear exactly where your
              eyes already look — measured from your own field of view and
              printed as a calibration map that ships with every helmet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/contact" />}>
                Book a demo ride
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/shop" />}>
                Shop the lineup
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Free 45-minute fitting &amp; ride · No payment until you confirm
            </p>
          </div>
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-2xl border bg-muted/30">
              <HelmetViewer className="h-full w-full" />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Drag to rotate — the visor display faces the rider
            </p>
          </div>
        </div>
      </section>
      <StickyCta watchId="hero" />

      {/* 2 · Proof strip */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-2xl font-semibold tabular-nums">12</p>
            <p className="text-sm text-muted-foreground">
              live data layers, updated over the air
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular-nums">45 min</p>
            <p className="text-sm text-muted-foreground">
              demo ride slots at the Copenhagen studio
            </p>
          </div>
          <div>
            <p className="text-sm leading-6">
              “The HUD sat exactly where the sheet said it would.”
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              — Freja, Nørrebro
            </p>
          </div>
        </div>
      </section>

      {/* 3 · Offer grid — data layers from the CMS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Real-time layers over the road
            </h2>
            <p className="mt-2 text-muted-foreground">
              Each layer renders on the visor at the position from your
              calibration map — never in the way, always in reach.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/layers" />}>
            Explore all 12 layers
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="mt-8">
          <DataLayersPreview limit={6} />
        </div>
      </section>

      {/* 4 · Signature detail — the calibration map */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <Card className="order-last lg:order-first">
            <CardContent>
              <div className="relative aspect-square">
                <div className="absolute inset-x-0 top-1/2 border-t border-dashed" />
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed" />
                <p className="absolute top-3 left-3 font-mono text-xs text-muted-foreground">
                  CALIBRATION MAP · M-2261
                </p>
                <p className="absolute top-3 right-3 font-mono text-xs text-muted-foreground">
                  FOV 114°
                </p>
                <p className="absolute top-[18%] left-1/2 -translate-x-1/2 rounded-md border bg-background px-2 py-1 font-mono text-xs">
                  NAV · center-high
                </p>
                <p className="absolute bottom-[22%] left-[8%] rounded-md border bg-background px-2 py-1 font-mono text-xs">
                  SPEED · 12° low-left
                </p>
                <p className="absolute right-[6%] bottom-[38%] rounded-md border bg-background px-2 py-1 font-mono text-xs">
                  HAZARD · periphery
                </p>
                <p className="absolute bottom-3 left-3 font-mono text-xs text-muted-foreground">
                  measured at fitting · 14 Cykelgade
                </p>
              </div>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Every helmet ships with your printed calibration map
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              At your fitting we measure where your eyes actually rest on the
              road, then position every layer around that — not over it. The
              map is printed, packed with the helmet, and stored in your
              profile so replacement visors arrive pre-calibrated.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Ruler className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  Measured in-person during the 45-minute fitting ride
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Printer className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Printed and packed in the box with every helmet</span>
              </li>
              <li className="flex items-start gap-3">
                <Eye className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  Layers render at your positions — no generic overlay grid
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 · Featured products — the three models */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight">
              Three models. One calibration.
            </h2>
            <p className="mt-2 text-muted-foreground">
              City, One, or Pro — every model gets the same fitting and the
              same printed map.
            </p>
          </div>
          <Button variant="outline" render={<Link href="/shop" />}>
            Compare in the shop
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="mt-8">
          <HelmetsGrid />
        </div>
      </section>

      {/* 6 · Stories — testimonials from the CMS */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight">
            Riders around Copenhagen
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            From daily bridge commuters to 200-kilometre weekenders.
          </p>
          <div className="mt-8">
            <TestimonialsSection />
          </div>
        </div>
      </section>

      {/* 7 · Trust + FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto mb-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-4" /> CE EN 1078 certified
          </span>
          <span className="flex items-center gap-2">
            <Clock className="size-4" /> Replies within one business day
          </span>
          <span className="flex items-center gap-2">
            <Check className="size-4" /> No payment until you confirm the fit
          </span>
        </div>
        <FaqSection />
      </section>

      {/* 8 · Final CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            Ride it before you buy it.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            45 minutes at the studio: fitting, calibration, and a ride on the
            cycle lane outside.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/contact" />}>
              Book a demo ride
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="ghost" render={<Link href="/contact" />}>
              Ask a question
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
