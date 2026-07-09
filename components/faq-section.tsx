"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { RicosContent, ricosToPlainText } from "@/components/ricos-content"
import { FAQ_COLLECTION_ID, wix } from "@/lib/wix"
import { cn } from "@/lib/utils"

type FaqItem = {
  _id: string
  question?: string
  answer?: unknown
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

export function FaqSection() {
  const [faqs, setFaqs] = React.useState<FaqItem[] | null>(null)
  const [error, setError] = React.useState(false)
  const [open, setOpen] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    wix.items
      .query(FAQ_COLLECTION_ID)
      .limit(50)
      .find()
      .then((res: { items: unknown[] }) => {
        if (!cancelled) setFaqs(res.items as unknown as FaqItem[])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Fail quietly — the FAQ section simply doesn't render if the
  // collection isn't available yet.
  if (error) return null

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-3xl font-semibold tracking-tight">
        Frequently asked questions
      </h2>
      <p className="mt-2 text-center text-muted-foreground">
        Everything you need to know about going headless with us.
      </p>

      <div className="mt-8">
        {faqs === null ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No FAQs yet — check back soon.
          </p>
        ) : (
          <div className="divide-y divide-border/60 rounded-xl border border-border/60">
            {faqs.map((faq) => {
              const isOpen = open === faq._id
              return (
                <div key={faq._id}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : faq._id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-colors hover:bg-muted/40"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground">
                      <FaqAnswer answer={faq.answer} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
