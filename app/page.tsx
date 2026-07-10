import Link from "next/link"
import {
  ArrowRight,
  Camera,
  Radar,
  ShieldCheck,
  Volume2,
  Waypoints,
} from "lucide-react"

import { DataLayersCarousel } from "@/components/data-layers"
import { FaqSection } from "@/components/faq-section"
import { HelmetsGrid } from "@/components/helmets"
import { HelmetViewer } from "@/components/helmet-viewer"
import { HudSimulator } from "@/components/hud-simulator"
import { StickyCta } from "@/components/sticky-cta"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BUSINESS } from "@/lib/wix"
import { bakedFaqs, bakedHelmets, bakedLayers, bakedTestimonials } from "@/lib/baked"
import type { FaqItem } from "@/components/faq-section"
import type { Testimonial } from "@/components/testimonials-section"
import type { DataLayer } from "@/components/data-layers"

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: BUSINESS.name,
  description:
    "AR smart bicycle helmet studio in Copenhagen. Three helmet models with a built-in visor display and speakers — twelve real-time data layers, placed automatically.",
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

const stats = [
  { value: "12", label: "live data layers, updated over the air" },
  { value: "12 hr", label: "battery on the Pro — 8 on the One" },
  { value: "380 g", label: "the City, our lightest shell" },
  { value: "114°", label: "field of view on the visor display" },
]

const safetyFeatures = [
  {
    icon: ShieldCheck,
    title: "CE EN 1078 certified",
    body: "Every model passes the same impact standard as a conventional helmet — the electronics ride inside a shell that protects first.",
  },
  {
    icon: Volume2,
    title: "Open-ear audio",
    body: "Speakers sit in front of your ears, never over them. Directions and calls come through; the street stays fully audible.",
  },
  {
    icon: Radar,
    title: "Blind-spot radar",
    body: "On the Pro, rear-approaching vehicles appear as arcs at the edge of your view, sized by how fast they're closing.",
  },
  {
    icon: Camera,
    title: "Rear camera view",
    body: "A glanceable live rear view on the Pro — check behind you without turning your head on a fast descent.",
  },
  {
    icon: Waypoints,
    title: "A hazard network of riders",
    body: "Door zones, potholes, and tram tracks flagged by 4,000+ Copenhagen riders, rendered before you reach them.",
  },
]

export default async function HomePage() {
  const [initialHelmets, initialTestimonials, initialFaqs, initialLayers] =
    await Promise.all([
      bakedHelmets(),
      bakedTestimonials<Testimonial>(),
      bakedFaqs<FaqItem>(),
      bakedLayers<DataLayer>(),
    ])
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />

      {/* Product bar — local nav under the site header */}
      <div className="sticky top-14 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4 sm:px-6">
          <p className="text-sm font-semibold tracking-tight">HaloRide</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
              render={<Link href="/contact" />}
            >
              Book a demo ride
            </Button>
            <Button size="sm" render={<Link href="/shop" />}>
              Shop
            </Button>
          </div>
        </div>
      </div>

      {/* Hero — tagline first, full-width 3D product view */}
      <section id="hero" className="border-b">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 text-center sm:px-6 lg:pt-24">
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            The smart helmet you&apos;ve been waiting for
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-pretty text-muted-foreground">
            The AR cycling helmet with a built-in visor display and speakers.
            Speed, navigation, and hazards appear exactly where your eyes
            already look — placed automatically. Built in Copenhagen.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/contact" />}>
              Book a demo ride
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/shop" />}>
              Shop the lineup
            </Button>
          </div>
          <div className="mt-12">
            <div className="mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-2xl border bg-muted/30">
              <HelmetViewer className="h-full w-full" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Drag to rotate — the visor display faces the rider
            </p>
          </div>
        </div>
      </section>
      <StickyCta watchId="hero" />

      {/* Highlights — the interactive HUD demo */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get the highlights.
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            This is the rider&apos;s view with all six core layers live —
            select one to see it in action. The visor places and animates
            every layer automatically.
          </p>
          <div className="mt-8">
            <HudSimulator />
          </div>
        </div>
      </section>

      {/* Stat callouts — big numbers */}
      <section className="border-b">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-24">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">
                {s.value}
              </p>
              <p className="mx-auto mt-3 max-w-40 text-sm text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Layer gallery — horizontal rail of all twelve */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Twelve layers. Zero setup.
              </h2>
              <p className="mt-2 text-muted-foreground">
                Scroll the full set — from turn-by-turn arrows to battery
                diagnostics. New layers arrive over the air.
              </p>
            </div>
            <Button variant="outline" render={<Link href="/layers" />}>
              Explore all layers
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="mt-8">
            <DataLayersCarousel initialLayers={initialLayers} />
          </div>
        </div>
      </section>

      {/* Safety chapter — vertical feature cards */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A helmet first. Then a heads-up display.
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Everything the display does is built on top of a shell that
            protects like a helmet should.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {safetyFeatures.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icon className="size-4" />
                  </span>
                  <CardTitle className="mt-2 text-base">{f.title}</CardTitle>
                  <CardDescription>{f.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            <Card className="bg-muted/50">
              <CardContent className="flex h-full flex-col justify-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  “Hazard alerts have flagged two opening car doors before I
                  saw them. I don&apos;t ride without it now.”
                </p>
                <p className="mt-3 text-sm font-medium">— Mette, Vesterbro</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lineup + comparison */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Which HaloRide is yours?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
              City for the everyday, One for every commute, Pro for the long
              road. Every model gets the same fitting at the studio.
            </p>
          </div>
          <div className="mt-10">
            <HelmetsGrid initialHelmets={initialHelmets} />
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" render={<Link href="/shop" />}>
              Compare all models
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>

      {/* Riders — testimonials from the CMS */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Riders around Copenhagen.
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            From daily bridge commuters to 200-kilometre weekenders.
          </p>
          <div className="mt-8">
            <TestimonialsSection initialItems={initialTestimonials} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <FaqSection initialFaqs={initialFaqs} />
      </section>

      {/* Final CTA */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ride it before you buy it.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            45 minutes at the studio: fitting, calibration, and a ride on the
            cycle lane outside. Free, and no payment until you confirm.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/contact" />}>
              Book a demo ride
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="ghost" render={<Link href="/shop" />}>
              Shop the lineup
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
