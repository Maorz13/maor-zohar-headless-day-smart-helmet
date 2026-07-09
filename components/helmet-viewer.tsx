"use client"

import * as React from "react"

/**
 * Interactive 3D helmet for the hero. The model-viewer bundle is self-hosted
 * (public/vendor/model-viewer.min.js) and injected on idle so it never blocks
 * LCP; until the element upgrades, the container shows a lightweight
 * placeholder. Reduced-motion users get no auto-rotate.
 *
 * The GLB is a placeholder asset (Khronos "Damaged Helmet" sample) — swap
 * public/models/haloride-helmet.glb for the real product model when available.
 */
export function HelmetViewer({ className }: { className?: string }) {
  const [ready, setReady] = React.useState(false)
  const [autoRotate, setAutoRotate] = React.useState(true)

  React.useEffect(() => {
    setAutoRotate(
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )

    if (customElements.get("model-viewer")) {
      setReady(true)
      return
    }

    let cancelled = false
    const load = () => {
      const script = document.createElement("script")
      script.type = "module"
      script.src = "/vendor/model-viewer.min.js"
      script.onload = () => {
        customElements.whenDefined("model-viewer").then(() => {
          if (!cancelled) setReady(true)
        })
      }
      document.head.appendChild(script)
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(load, { timeout: 2000 })
    } else {
      setTimeout(load, 200)
    }
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={className}>
      {ready ? (
        <model-viewer
          src="/models/haloride-helmet.glb"
          alt="Interactive 3D model of the HaloRide AR smart helmet"
          camera-controls
          {...(autoRotate ? { "auto-rotate": "" } : {})}
          rotation-per-second="12deg"
          shadow-intensity="1"
          exposure="1.1"
          interaction-prompt="none"
          touch-action="pan-y"
          camera-orbit="30deg 78deg 105%"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="mx-auto size-24 animate-pulse rounded-full bg-muted" />
            <p className="mt-4 text-xs text-muted-foreground">
              Loading 3D model…
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
