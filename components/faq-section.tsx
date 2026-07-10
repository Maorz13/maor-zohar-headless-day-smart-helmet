"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { RicosContent, ricosToPlainText } from "@/components/ricos-content"
import { FAQ_COLLECTION_ID } from "@/lib/wix"
import { fetchCollectionItems } from "@/lib/wix-data"

export type FaqItem = {
  _id: string
  question?: string
  answer?: unknown
  order?: number
}

function FaqAnswer({ answer }: { answer: unknown }) {
  if (typeof answer === "string") {
    return <p className="leading-7 whitespace-pre-line">{answer}</p>
  }
  if (answer && typeof answer === "object") {
    if ((answer as { nodes?: unknown[] }).nodes) {
      return <RicosContent content={answer} />
    }
    const text = ricosToPlainText(answer)
    if (text) return <p className="leading-7 whitespace-pre-line">{text}</p>
  }
  return null
}

export function FaqSection({
  title = "Frequently asked questions",
  subtitle = "Demo rides, fittings, and how the calibration map works.",
  initialFaqs,
}: {
  title?: string
  subtitle?: string
  initialFaqs?: FaqItem[]
}) {
  const hadInitial = !!initialFaqs?.length
  const [faqs, setFaqs] = React.useState<FaqItem[] | null>(
    hadInitial ? (initialFaqs as FaqItem[]) : null
  )
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    fetchCollectionItems<FaqItem>(FAQ_COLLECTION_ID)
      .then((items) => {
        if (!cancelled) setFaqs(items)
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

  // Fail quietly — the FAQ section simply doesn't render if the
  // collection isn't available yet.
  if (error) return null

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-center text-muted-foreground">{subtitle}</p>

      <div className="mt-8">
        {faqs === null ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No FAQs yet — check back soon.
          </p>
        ) : (
          <Accordion>
            {faqs.map((faq) => (
              <AccordionItem key={faq._id} value={faq._id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground">
                    <FaqAnswer answer={faq.answer} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
