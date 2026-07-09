import Link from "next/link"
import { Bike, Clock, Mail, MapPin, Phone } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { BUSINESS } from "@/lib/wix"

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/layers", label: "Data Layers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Bike className="size-4" />
              </span>
              <span className="tracking-tight">{BUSINESS.name}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              The AR cycling helmet from Copenhagen. Every helmet ships with a
              printed calibration map of your own field of view.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Visit us</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>
                  {BUSINESS.street}, {BUSINESS.city}, {BUSINESS.country}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <span>{BUSINESS.hours}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="hover:text-foreground"
                >
                  {BUSINESS.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a
                  href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}
                  className="hover:text-foreground"
                >
                  {BUSINESS.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Pages</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Follow along</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href={BUSINESS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Instagram — @haloride
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  TikTok — @haloride
                </a>
              </li>
            </ul>
            <h3 className="mt-6 text-sm font-medium">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 {BUSINESS.name}. All rights reserved.</p>
          <a
            href="https://www.wix.com/lp-en/headless"
            target="_blank"
            rel="noopener"
            className="hover:text-foreground"
          >
            Powered by Wix Headless
          </a>
        </div>
      </div>
    </footer>
  )
}
