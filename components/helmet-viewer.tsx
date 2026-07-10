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

export function HelmetViewer({ className }: { className?: string }) {
  const [ready, setReady] = React.useState(false)
  const [autoRotate, setAutoRotate] = React.useState(true)

  React.useEffect(() => {
    setAutoRotate(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )

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
      {ready ? <Helmet3D autoRotate={autoRotate} /> : <Placeholder />}
    </div>
  )
}
