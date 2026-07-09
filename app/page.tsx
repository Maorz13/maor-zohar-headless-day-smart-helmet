import Link from "next/link"
import { ArrowRight, BookOpen, CalendarDays, ShoppingBag } from "lucide-react"

import { FaqSection } from "@/components/faq-section"
import { Button } from "@/components/ui/button"

const sections = [
  {
    href: "/shop",
    icon: ShoppingBag,
    title: "Dev merch shop",
    description:
      "Keyboard-friendly apparel and desk gear for people who ship. Checkout is powered by Wix eCommerce.",
    cta: "Browse the shop",
  },
  {
    href: "/blog",
    icon: BookOpen,
    title: "Headless blog",
    description:
      "Deep dives on headless architecture, composable stacks, and API-first development.",
    cta: "Read the blog",
  },
  {
    href: "/bookings",
    icon: CalendarDays,
    title: "Consulting sessions",
    description:
      "Book 1:1 time with our engineers to plan, review, or unblock your headless build.",
    cta: "Book a session",
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,--theme(--color-primary/8%),transparent_60%)]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="rounded-full border border-border bg-muted/60 px-3 py-1 font-mono text-xs text-muted-foreground">
            {"</>"} the developer-lifestyle brand
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Every day is a{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Headless Day
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            Merch for people who ship, writing on headless architecture, and
            consulting sessions to get your composable stack unstuck.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/shop" />}>
              Shop the merch
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/bookings" />}>
              Book a session
            </Button>
          </div>
        </div>
      </section>

      {/* Section links */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-border hover:bg-muted/40"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                {s.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {s.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQs — live from the Wix CMS */}
      <FaqSection />
    </>
  )
}
