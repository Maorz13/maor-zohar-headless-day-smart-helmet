"use client"

import * as React from "react"
import dynamic from "next/dynamic"

/**
 * Interactive 3D helmet for the hero, rendered with three.js via React Three
 * Fiber. The model is built procedurally in helmet-3d.tsx (no GLB download),
 * and the three.js chunk is mounted on idle so it never blocks LCP; until
 * then the container shows a lightweight placeholder. Reduced-motion users
 * get no auto-rotate.
 */

const Helmet3D = dynamic(() => import("@/components/helmet-3d"), {
  ssr: false,
  loading: () => <Placeholder />,
})

function Placeholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <div className="mx-auto size-24 animate-pulse rounded-full bg-muted" />
        <p className="mt-4 text-xs text-muted-foreground">Loading 3D model…</p>
      </div>
    </div>
  )
}

function MobilePoster({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[inherit]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,--theme(--color-primary/12%),transparent_65%)]"
      />
      <div
        aria-hidden
        className="size-36 rounded-[48%_52%_44%_56%/58%_54%_46%_42%] border border-border bg-gradient-to-br from-muted to-background shadow-[inset_0_-12px_24px_-12px_--theme(--color-primary/25%)]"
      />
      <button
        type="button"
        onClick={onActivate}
        className="absolute inset-x-0 bottom-6 mx-auto w-fit rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur transition-colors hover:bg-accent"
      >
        View in 3D
      </button>
    </div>
  )
}

export function HelmetViewer({ className }: { className?: string }) {
  const [ready, setReady] = React.useState(false)
  // null until we know; mobile devices never auto-mount the three.js chunk —
  // 3D costs several seconds of main-thread time on throttled CPUs, so it
  // waits for an explicit tap ("View in 3D") instead.
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)
  const [autoRotate, setAutoRotate] = React.useState(true)

  React.useEffect(() => {
    setAutoRotate(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
    const mobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 768
    setIsMobile(mobile)
    if (mobile) return

    let cancelled = false
    const mount = () => {
      if (!cancelled) setReady(true)
    }
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(mount, { timeout: 2000 })
    } else {
      setTimeout(mount, 200)
    }
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={className}>
      {ready ? (
        <Helmet3D autoRotate={autoRotate} />
      ) : isMobile ? (
        <MobilePoster onActivate={() => setReady(true)} />
      ) : (
        <Placeholder />
      )}
    </div>
  )
}
