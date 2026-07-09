"use client"

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TESTIMONIALS_COLLECTION_ID, wix } from "@/lib/wix"

type Testimonial = {
  _id: string
  quote?: string
  name?: string
  neighborhood?: string
  context?: string
  order?: number
}

export function TestimonialsSection() {
  const [items, setItems] = React.useState<Testimonial[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    wix.items
      .query(TESTIMONIALS_COLLECTION_ID)
      .ascending("order")
      .limit(8)
      .find()
      .then((res: { items: unknown[] }) => {
        if (!cancelled) setItems(res.items as unknown as Testimonial[])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
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
