"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"

import { imgSrc, wix } from "@/lib/wix"

type Post = {
  _id?: string
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  firstPublishedDate?: Date | string | null
  minutesToRead?: number | null
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

export default function BlogPage() {
  const [posts, setPosts] = React.useState<Post[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    wix.posts
      .queryPosts({ fieldsets: ["URL"] })
      .descending("firstPublishedDate")
      .limit(20)
      .find()
      .then((res) => {
        if (!cancelled) setPosts(res.items as Post[])
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-mono text-sm text-primary">/blog</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        The Headless Day blog
      </h1>
      <p className="mt-3 text-muted-foreground">
        Notes on headless architecture, composable commerce, and the API-first
        life — fetched live from Wix Blog.
      </p>

      <div className="mt-10">
        {error ? (
          <EmptyState
            title="Couldn't load posts"
            body="Something went wrong fetching the blog. Please try again in a moment."
          />
        ) : posts === null ? (
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-muted/50" />
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted/50" />
                <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            body="The first article is being written as we speak. Check back soon."
          />
        ) : (
          <div className="divide-y divide-border/60">
            {posts.map((post) => {
              const cover = imgSrc(post.media?.wixMedia?.image, 400, 300)
              return (
                <article key={post._id} className="group py-8 first:pt-0">
                  <Link
                    href={`/blog/post?slug=${encodeURIComponent(post.slug ?? "")}`}
                    className="flex items-start justify-between gap-6"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                        <time>{formatDate(post.firstPublishedDate)}</time>
                        {post.minutesToRead ? (
                          <>
                            <span aria-hidden>·</span>
                            <span>{post.minutesToRead} min read</span>
                          </>
                        ) : null}
                      </div>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight group-hover:underline group-hover:underline-offset-4">
                        {post.title}
                      </h2>
                      {post.excerpt ? (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                          {post.excerpt}
                        </p>
                      ) : null}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Read post
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt=""
                        className="hidden aspect-[4/3] w-36 shrink-0 rounded-lg object-cover sm:block"
                      />
                    ) : null}
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <FileText className="size-8 text-muted-foreground/60" />
      <h2 className="mt-4 font-medium">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  )
}
