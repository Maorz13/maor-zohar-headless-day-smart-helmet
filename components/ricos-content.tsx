import * as React from "react"

/**
 * Minimal Ricos rich-content renderer for blog posts / CMS rich text.
 * Covers paragraphs, headings, lists, blockquotes, code blocks, dividers
 * and inline decorations (bold / italic / underline / code / links).
 * Unknown node types render their children defensively.
 */

type RicosDecoration = {
  type?: string
  linkData?: { link?: { url?: string; target?: string } }
}

type RicosNode = {
  type?: string
  id?: string
  nodes?: RicosNode[]
  textData?: { text?: string; decorations?: RicosDecoration[] }
  headingData?: { level?: number }
}

type RicosDocument = { nodes?: RicosNode[] }

function TextNode({ node }: { node: RicosNode }) {
  let el: React.ReactNode = node.textData?.text ?? ""
  for (const d of node.textData?.decorations ?? []) {
    switch (d.type) {
      case "BOLD":
        el = <strong>{el}</strong>
        break
      case "ITALIC":
        el = <em>{el}</em>
        break
      case "UNDERLINE":
        el = <u>{el}</u>
        break
      case "CODE":
        el = (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]">
            {el}
          </code>
        )
        break
      case "LINK": {
        const url = d.linkData?.link?.url
        if (url) {
          el = (
            <a
              href={url}
              target={d.linkData?.link?.target === "BLANK" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              {el}
            </a>
          )
        }
        break
      }
      default:
        break
    }
  }
  return <>{el}</>
}

function plainText(node: RicosNode): string {
  if (node.type === "TEXT") return node.textData?.text ?? ""
  return (node.nodes ?? []).map(plainText).join("")
}

function Children({ nodes }: { nodes?: RicosNode[] }) {
  return (
    <>
      {(nodes ?? []).map((n, i) => (
        <Node key={n.id ?? i} node={n} />
      ))}
    </>
  )
}

function Node({ node }: { node: RicosNode }) {
  switch (node.type) {
    case "TEXT":
      return <TextNode node={node} />
    case "PARAGRAPH":
      return (
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          <Children nodes={node.nodes} />
        </p>
      )
    case "HEADING": {
      const level = Math.min(Math.max(node.headingData?.level ?? 2, 1), 6)
      const cls =
        level <= 2
          ? "mt-8 text-2xl font-semibold tracking-tight first:mt-0"
          : "mt-6 text-xl font-semibold tracking-tight first:mt-0"
      return React.createElement(
        `h${level}`,
        { className: cls },
        <Children nodes={node.nodes} />
      )
    }
    case "BULLETED_LIST":
      return (
        <ul className="mt-4 list-disc space-y-1 pl-6">
          <Children nodes={node.nodes} />
        </ul>
      )
    case "ORDERED_LIST":
      return (
        <ol className="mt-4 list-decimal space-y-1 pl-6">
          <Children nodes={node.nodes} />
        </ol>
      )
    case "LIST_ITEM":
      return (
        <li className="leading-7">
          {/* list items wrap their content in paragraphs — unwrap them */}
          {(node.nodes ?? []).map((n, i) =>
            n.type === "PARAGRAPH" ? (
              <Children key={n.id ?? i} nodes={n.nodes} />
            ) : (
              <Node key={n.id ?? i} node={n} />
            )
          )}
        </li>
      )
    case "BLOCKQUOTE":
      return (
        <blockquote className="mt-4 border-l-2 border-border pl-4 text-muted-foreground italic">
          <Children nodes={node.nodes} />
        </blockquote>
      )
    case "CODE_BLOCK":
      return (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
          <code>{plainText(node)}</code>
        </pre>
      )
    case "DIVIDER":
      return <hr className="my-8 border-border" />
    default:
      // unknown node — render its children rather than dropping content
      return <Children nodes={node.nodes} />
  }
}

export function RicosContent({ content }: { content: unknown }) {
  const doc = content as RicosDocument | undefined
  if (!doc?.nodes?.length) return null
  return (
    <div className="text-base text-foreground">
      <Children nodes={doc.nodes} />
    </div>
  )
}

/** Extract plain text from a Ricos document (for excerpts / CMS answers). */
export function ricosToPlainText(content: unknown): string {
  const doc = content as RicosDocument | undefined
  if (!doc?.nodes) return ""
  return doc.nodes.map(plainText).join("\n").trim()
}
