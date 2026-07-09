import Link from "next/link"
import { Terminal } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Terminal className="size-4" />
          <span>
            Headless Day — dev merch, headless architecture &amp; consulting.
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-foreground">
            Shop
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Blog
          </Link>
          <Link href="/bookings" className="hover:text-foreground">
            Bookings
          </Link>
        </nav>
      </div>
    </footer>
  )
}
