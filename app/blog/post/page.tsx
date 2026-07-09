"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { RicosContent } from "@/components/ricos-content"
import { Button } from "@/components/ui/button"
import { imgSrc, wix } from "@/lib/wix"

type Post = {
  _id?: string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  firstPublishedDate?: Date | string | null
  minutesToRead?: number | null
  richContent?: unknown
  media?: { wixMedia?: { image?: string | null } | null } | null
}

function formatDate(d?: Date | string | null): string {
  if (!d) return ""
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function PostDetail() {
  const params = useSearchParams()
  const slug = params.get("slug")

  const [post, setPost] = React.useState<Post | null | undefined>(undefined)

  React.useEffect(() => {
    if (!slug) {
      setPost(null)
      return
    }
    let cancelled = false
    wix.posts
      .queryPosts({ fieldsets: ["RICH_CONTENT", "URL"] })
      .eq("slug", slug)
      .find()
      .then((res) => {
        if (!cancelled) setPost((res.items[0] as Post) ?? null)
      })
      .catch(() => {
        if (!cancelled) setPost(null)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (post === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-muted/50" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-muted/50" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted/50" />
      </div>
    )
  }

  if (post === null) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <h1 className="font-medium">Post not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This post may have moved or is still being published.
        </p>
        <Button className="mt-6" variant="outline" render={<Link href="/blog" />}>
          <ArrowLeft data-icon="inline-start" />
          Back to blog
        </Button>
      </div>
    )
  }

  const cover = imgSrc(post.media?.wixMedia?.image, 1200, 630)

  return (
    <article>
      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <time>{formatDate(post.firstPublishedDate)}</time>
        {post.minutesToRead ? (
          <>
            <span aria-hidden>·</span>
            <span>{post.minutesToRead} min read</span>
          </>
        ) : null}
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt ? (
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
      ) : null}
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className="mt-8 aspect-video w-full rounded-xl object-cover"
        />
      ) : null}
      <div className="mt-8">
        <RicosContent content={post.richContent} />
      </div>
    </article>
  )
}

export default function BlogPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>
      <div className="mt-8">
        <React.Suspense
          fallback={
            <div className="h-64 w-full animate-pulse rounded-xl bg-muted/50" />
          }
        >
          <PostDetail />
        </React.Suspense>
      </div>
    </div>
  )
}
