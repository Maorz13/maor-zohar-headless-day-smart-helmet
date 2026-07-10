"use client"

import * as React from "react"
import {
  Gauge,
  HeartPulse,
  Layers,
  Navigation,
  TriangleAlert,
  Waypoints,
  Wind,
} from "lucide-react"

import { useDataLayers, type DataLayer } from "@/components/data-layers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SceneKey = "nav" | "hazard" | "speed" | "heart" | "traffic" | "wind"

/** The six core layers the simulator can play, matched to CMS items by name. */
const SCENE_LAYERS: {
  key: SceneKey
  re: RegExp
  fallbackName: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { key: "nav", re: /navigation/i, fallbackName: "Turn-by-turn navigation", icon: Navigation },
  { key: "hazard", re: /hazard/i, fallbackName: "Hazard alerts", icon: TriangleAlert },
  { key: "speed", re: /speed|cadence/i, fallbackName: "Speed & cadence", icon: Gauge },
  { key: "heart", re: /heart/i, fallbackName: "Heart-rate zones", icon: HeartPulse },
  { key: "traffic", re: /traffic/i, fallbackName: "Traffic flow", icon: Waypoints },
  { key: "wind", re: /wind|weather/i, fallbackName: "Wind & weather", icon: Wind },
]

/** Dim everything except the active layer; everything full when none active. */
function layerCn(selected: SceneKey | null, me: SceneKey, extra?: string) {
  return cn(
    "transition-opacity duration-300",
    selected !== null && selected !== me ? "opacity-25" : "opacity-100",
    extra
  )
}

function VisorScene({ selected }: { selected: SceneKey | null }) {
  const [speed, setSpeed] = React.useState(24)
  const [cadence, setCadence] = React.useState(92)
  const [zone, setZone] = React.useState(2)

  // Live-ticking numbers while their layer is selected.
  React.useEffect(() => {
    if (selected !== "speed" && selected !== "heart") return
    const t = window.setInterval(() => {
      setSpeed(22 + Math.round(Math.random() * 6))
      setCadence(88 + Math.round(Math.random() * 8))
      setZone((z) => (z >= 4 ? 2 : z + 1))
    }, 700)
    return () => window.clearInterval(t)
  }, [selected])

  const active = (k: SceneKey) => selected === k

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-gradient-to-b from-muted/20 via-muted/40 to-muted">
      {/* Road scene */}
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        {/* Road surface */}
        <polygon
          points="240,500 560,500 425,220 375,220"
          className="fill-foreground/10"
        />
        {/* Centre line */}
        <line
          x1="400"
          y1="500"
          x2="400"
          y2="225"
          strokeDasharray="26 22"
          className="stroke-background/80"
          strokeWidth="4"
        />
        {/* Kerbs */}
        <line x1="240" y1="500" x2="375" y2="220" className="stroke-foreground/20" strokeWidth="3" />
        <line x1="560" y1="500" x2="425" y2="220" className="stroke-foreground/20" strokeWidth="3" />
        {/* Horizon */}
        <line x1="0" y1="222" x2="800" y2="222" className="stroke-foreground/10" strokeWidth="2" />

        {/* Traffic-flow segments on the lane ahead */}
        <g className={layerCn(selected, "traffic")}>
          {[
            "300,470 390,470 398,400 322,400",
            "330,388 396,388 401,330 352,330",
            "358,320 402,320 405,272 374,272",
          ].map((pts, i) => (
            <polygon
              key={i}
              points={pts}
              className={cn(
                i === 1 ? "fill-destructive/35" : "fill-primary/30",
                active("traffic") && "animate-pulse motion-reduce:animate-none"
              )}
              style={active("traffic") ? { animationDelay: `${i * 220}ms` } : undefined}
            />
          ))}
        </g>

        {/* Parked car (hazard source) */}
        <g className={layerCn(selected, "hazard")}>
          <rect x="580" y="330" width="120" height="52" rx="10" className="fill-foreground/25" />
          <rect x="596" y="312" width="76" height="30" rx="8" className="fill-foreground/20" />
          <circle cx="606" cy="386" r="12" className="fill-foreground/40" />
          <circle cx="672" cy="386" r="12" className="fill-foreground/40" />
          {/* Door-zone warning arc */}
          <path
            d="M 574 388 A 46 46 0 0 1 574 300"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className={cn(
              "stroke-destructive/80",
              active("hazard") && "animate-pulse motion-reduce:animate-none"
            )}
          />
          {active("hazard") ? (
            <path
              d="M 556 402 A 66 66 0 0 1 556 288"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-pulse stroke-destructive/50 motion-reduce:animate-none"
              style={{ animationDelay: "300ms" }}
            />
          ) : null}
        </g>

        {/* Navigation chevrons up the lane */}
        <g className={layerCn(selected, "nav")}>
          {[
            { d: "M 368 452 L 400 420 L 432 452", w: 9 },
            { d: "M 376 396 L 400 372 L 424 396", w: 7 },
            { d: "M 383 348 L 400 331 L 417 348", w: 5 },
          ].map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill="none"
              strokeWidth={c.w}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "stroke-primary",
                active("nav") && "animate-pulse motion-reduce:animate-none"
              )}
              style={active("nav") ? { animationDelay: `${i * 200}ms` } : undefined}
            />
          ))}
        </g>
      </svg>

      {/* Status line */}
      <p className="absolute top-3 left-4 font-mono text-[11px] text-muted-foreground">
        {selected === null
          ? "LIVE · ALL LAYERS"
          : `LIVE · ${SCENE_LAYERS.find((l) => l.key === selected)?.fallbackName.toUpperCase()}`}
      </p>

      {/* Nav instruction pill */}
      <div
        className={layerCn(
          selected,
          "nav",
          "absolute top-[10%] left-1/2 -translate-x-1/2"
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1 font-mono text-xs shadow-sm",
            active("nav") && "animate-pulse motion-reduce:animate-none"
          )}
        >
          <Navigation className="size-3.5 text-primary" />
          200 m — right on Cykelgade
        </span>
      </div>

      {/* Hazard callout */}
      <div
        className={layerCn(
          selected,
          "hazard",
          "absolute top-[48%] right-[4%]"
        )}
      >
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 font-mono text-[11px] shadow-sm",
            active("hazard") && "animate-pulse motion-reduce:animate-none"
          )}
        >
          <TriangleAlert className="size-3.5 text-destructive" />
          door zone
        </span>
      </div>

      {/* Speed & cadence */}
      <div className={layerCn(selected, "speed", "absolute bottom-4 left-4")}>
        <div className="rounded-lg border bg-background/90 px-3 py-2 shadow-sm">
          <p className="font-mono text-2xl leading-none font-semibold tabular-nums">
            {speed}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              km/h
            </span>
          </p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground tabular-nums">
            {cadence} rpm
          </p>
        </div>
      </div>

      {/* Heart-rate zone bar */}
      <div
        className={layerCn(
          selected,
          "heart",
          "absolute right-3 bottom-[12%] flex flex-col items-center gap-1.5"
        )}
      >
        <div className="flex h-28 w-2 flex-col-reverse overflow-hidden rounded-full border bg-background/70">
          <div
            className={cn(
              "w-full rounded-full bg-primary transition-all duration-500",
              active("heart") && "animate-pulse motion-reduce:animate-none"
            )}
            style={{ height: `${zone * 25}%` }}
          />
        </div>
        <span className="rounded-md border bg-background/90 px-1.5 py-0.5 font-mono text-[11px] tabular-nums">
          Z{active("heart") ? zone : 2}
        </span>
      </div>

      {/* Wind & weather */}
      <div className={layerCn(selected, "wind", "absolute top-3 right-4")}>
        <span
          className={cn(
            "flex items-center gap-1.5 rounded-full border bg-background/90 px-2.5 py-1 font-mono text-[11px] shadow-sm",
            active("wind") && "animate-pulse motion-reduce:animate-none"
          )}
        >
          <Wind
            className={cn(
              "size-3.5 text-primary transition-transform duration-500",
              active("wind") && "-rotate-45"
            )}
          />
          NW 6 m/s · rain in 18 min
        </span>
      </div>
    </div>
  )
}

/**
 * The home-page signature section body: a simulated visor view of the six
 * core layers. All layers render by default; selecting one animates it and
 * shows its details from the CMS.
 */
export function HudSimulator() {
  const { layers } = useDataLayers()
  const [selected, setSelected] = React.useState<SceneKey | null>(null)

  // Pair each scene layer with its CMS item (for names, specs, details).
  const paired = SCENE_LAYERS.map((sl) => ({
    ...sl,
    cms: (layers ?? []).find((l: DataLayer) => sl.re.test(l.name ?? "")),
  }))
  const current = paired.find((p) => p.key === selected)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <VisorScene selected={selected} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {paired.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={selected === p.key ? "default" : "outline"}
              aria-pressed={selected === p.key}
              onClick={() =>
                setSelected((s) => (s === p.key ? null : p.key))
              }
            >
              <p.icon data-icon="inline-start" />
              {p.cms?.name ?? p.fallbackName}
            </Button>
          ))}
        </div>

        <Card className="flex-1">
          <CardContent>
            {current ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">
                    {current.cms?.name ?? current.fallbackName}
                  </h3>
                  {current.cms?.availability ? (
                    <Badge variant="outline">{current.cms.availability}</Badge>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {current.cms?.shortDescription}
                </p>
                {current.cms?.batteryCostOrRefreshRate ? (
                  <p className="mt-3 font-mono text-xs text-muted-foreground">
                    {current.cms.batteryCostOrRefreshRate}
                  </p>
                ) : null}
                {current.cms?.featuredNote ? (
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    {current.cms.featuredNote}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <h3 className="font-medium">All six layers, live</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This is the ride view. The visor positions and animates every
                  layer automatically — no setup, no manual calibration. Tap a
                  layer to see what it does on the road.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
