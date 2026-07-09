"use client"

import * as React from "react"
import {
  Battery,
  Gauge,
  HeartPulse,
  Layers,
  Mountain,
  Music,
  Navigation,
  Radar,
  Search,
  TriangleAlert,
  Users,
  Video,
  Waypoints,
  Wind,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { DATA_LAYERS_COLLECTION_ID, wix } from "@/lib/wix"

export type DataLayer = {
  _id: string
  name?: string
  shortDescription?: string
  batteryCostOrRefreshRate?: string
  availability?: string
  featuredNote?: string
  order?: number
}

/** Icon per layer, matched loosely by name; falls back to a generic mark. */
const LAYER_ICONS: [RegExp, React.ComponentType<{ className?: string }>][] = [
  [/navigation/i, Navigation],
  [/hazard/i, TriangleAlert],
  [/speed|cadence/i, Gauge],
  [/heart/i, HeartPulse],
  [/traffic/i, Waypoints],
  [/wind|weather/i, Wind],
  [/group/i, Users],
  [/elevation/i, Mountain],
  [/radar|blind/i, Radar],
  [/camera/i, Video],
  [/music|call/i, Music],
  [/battery|diagnostic/i, Battery],
]

function layerIcon(name?: string) {
  const match = LAYER_ICONS.find(([re]) => re.test(name ?? ""))
  return match?.[1] ?? Layers
}

export function useDataLayers() {
  const [layers, setLayers] = React.useState<DataLayer[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    wix.items
      .query(DATA_LAYERS_COLLECTION_ID)
      .ascending("order")
      .limit(50)
      .find()
      .then((res: { items: unknown[] }) => {
        if (!cancelled) setLayers(res.items as unknown as DataLayer[])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { layers, error }
}

export function DataLayerCard({ layer }: { layer: DataLayer }) {
  const Icon = layerIcon(layer.name)
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
          {layer.availability ? (
            <Badge variant="outline">{layer.availability}</Badge>
          ) : null}
        </div>
        <CardTitle className="mt-2 text-base">{layer.name}</CardTitle>
        <CardDescription>{layer.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="font-mono text-xs text-muted-foreground">
          {layer.batteryCostOrRefreshRate}
        </p>
        {layer.featuredNote ? (
          <p className="mt-2 text-xs text-muted-foreground italic">
            {layer.featuredNote}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function DataLayerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-xl" />
      ))}
    </div>
  )
}

/** Searchable, filterable grid — the /layers page body. */
export function DataLayersExplorer() {
  const { layers, error } = useDataLayers()
  const [query, setQuery] = React.useState("")
  const [availability, setAvailability] = React.useState<string>("all")

  const availabilityOptions = React.useMemo(() => {
    const set = new Set(
      (layers ?? []).map((l) => l.availability).filter(Boolean) as string[]
    )
    return [...set]
  }, [layers])

  const filtered = React.useMemo(() => {
    return (layers ?? []).filter((l) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        [l.name, l.shortDescription, l.featuredNote]
          .filter(Boolean)
          .some((s) => s!.toLowerCase().includes(q))
      const matchesAvailability =
        availability === "all" || l.availability === availability
      return matchesQuery && matchesAvailability
    })
  }, [layers, query, availability])

  if (error) {
    return (
      <p className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
        Couldn&apos;t load the data layers right now — please try again in a
        moment.
      </p>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search layers — navigation, radar, weather…"
            aria-label="Search data layers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={availability}
          onValueChange={(v) => setAvailability(v ?? "all")}
        >
          <SelectTrigger
            aria-label="Filter by model availability"
            className="sm:w-48"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All models</SelectItem>
            {availabilityOptions
              .filter((o) => o !== "All models")
              .map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {layers === null ? (
          <DataLayerGridSkeleton count={9} />
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
            No layers match “{query}” — try a different search.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <DataLayerCard key={l._id} layer={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/** Compact grid of the first N layers — the home-page offer grid. */
export function DataLayersPreview({ limit = 6 }: { limit?: number }) {
  const { layers, error } = useDataLayers()

  if (error) return null

  return layers === null ? (
    <DataLayerGridSkeleton count={limit} />
  ) : (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {layers.slice(0, limit).map((l) => (
        <DataLayerCard key={l._id} layer={l} />
      ))}
    </div>
  )
}
