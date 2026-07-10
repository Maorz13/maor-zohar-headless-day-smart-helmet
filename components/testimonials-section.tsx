"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TESTIMONIALS_COLLECTION_ID } from "@/lib/wix"
import { fetchCollectionItems } from "@/lib/wix-data"

export type Testimonial = {
  _id: string
  quote?: string
  name?: string
  neighborhood?: string
  context?: string
  order?: number
}

export function TestimonialsSection({
  initialItems,
}: {
  initialItems?: Testimonial[]
}) {
  const hadInitial = !!initialItems?.length
  const [items, setItems] = React.useState<Testimonial[] | null>(
    hadInitial ? (initialItems as Testimonial[]) : null
  )
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    fetchCollectionItems<Testimonial>(TESTIMONIALS_COLLECTION_ID, 8)
      .then((fetched) => {
        if (!cancelled) setItems(fetched)
      })
      .catch(() => {
        // Keep the baked data if we have it; only surface an error without it.
        if (!cancelled && !hadInitial) setError(true)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items === null
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))
        : items.map((t) => (
            <Card key={t._id}>
              <CardContent>
                <blockquote className="text-sm leading-6">
                  “{t.quote}”
                </blockquote>
                <footer className="mt-4 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    — {t.neighborhood}
                  </span>
                  {t.context ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.context}
                    </p>
                  ) : null}
                </footer>
              </CardContent>
            </Card>
          ))}
    </div>
  )
}
