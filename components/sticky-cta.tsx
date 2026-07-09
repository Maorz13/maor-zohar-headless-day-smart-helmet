"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

/**
 * Mobile-only sticky action bar. Appears after the element with the given id
 * (the hero) scrolls out of view, per the brief.
 */
export function StickyCta({ watchId }: { watchId: string }) {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    const target = document.getElementById(watchId)
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [watchId])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <Button className="flex-1" render={<Link href="/contact" />}>
          Book a demo ride
        </Button>
        <Button variant="outline" className="flex-1" render={<Link href="/shop" />}>
          Shop the lineup
        </Button>
      </div>
    </div>
  )
}
