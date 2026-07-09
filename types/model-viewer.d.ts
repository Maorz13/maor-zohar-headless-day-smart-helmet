import * as React from "react"

/**
 * JSX typing for the <model-viewer> custom element (self-hosted bundle in
 * public/vendor/model-viewer.min.js). Attributes are the kebab-case HTML
 * attributes the element documents.
 */
declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "model-viewer": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        > & {
          src?: string
          alt?: string
          poster?: string
          loading?: "auto" | "lazy" | "eager"
          reveal?: "auto" | "manual"
          "camera-controls"?: boolean | ""
          "auto-rotate"?: boolean | ""
          "rotation-per-second"?: string
          "shadow-intensity"?: string
          "touch-action"?: string
          "interaction-prompt"?: string
          "camera-orbit"?: string
          "field-of-view"?: string
          "disable-zoom"?: boolean | ""
          exposure?: string
        }
      }
    }
  }
}

export {}
