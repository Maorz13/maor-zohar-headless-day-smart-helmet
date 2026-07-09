# HaloRide

> AR smart bicycle helmet studio in Copenhagen, Denmark

**HEADLESS DAY brief spec-0600** · Category: **Consumer Electronics & Wearables** · Difficulty: **hard**

HaloRide is an AR smart bicycle helmet studio in Copenhagen, Denmark, focused on three models of its AR helmet with a built-in heads-up display and speakers, plus demo ride bookings. Its memorable detail is that every helmet ships with a printed calibration map of the rider's own field of view — the exact positions where speed, navigation, and hazard layers appear — giving the site a concrete visual anchor for products, services, and proof. The build should feel like a real local business with enough structured content for visitors to act immediately.

---

## Requirements

Your build is judged against these. All of them.

- [ ] Shop page with exactly 3 purchasable helmet models and clear prices

- [ ] Cart and checkout flow using Wix eCommerce and Stores

- [ ] Data Layers page with searchable CMS-driven AR layer listings

- [ ] Lead or booking form connected to the primary business action (demo ride booking)

- [ ] Mobile-first responsive design

## Art direction

|  |  |
| --- | --- |
| Mood | kinetic · precise · luminous · confident |

Treat the palette as a starting point - use the default shadcn ui styling and don't create custom styles.

---

# Creative brief

A richer brief to build from - structure, content, design, SEO, and performance. Hit the requirements above; let this guide how.

## Audience & voice

**Audience.** Urban commuters and road cyclists in and around Copenhagen who want a specific, trustworthy AR smart helmet studio and need proof, pricing, and the next step without searching twice

**Voice.** specific · assured · plainspoken · detail-led

**Avoid.** Avoid empty hype, sci-fi buzzwords, vague "future of mobility" language, and jokes that hide the offer

## Hero

**Headline.** An AR cycling helmet built around one unforgettable detail

**Layout.** Split hero: interactive 3D helmet model on one side, title text with primary and secondary CTAs anchored beside it

**Focal / LCP element.** An interactive 3D model of the HaloRide helmet that the visitor can rotate, with the HUD-facing visor and the printed calibration map of the rider's own field of view visible on the inner shell. The 3D viewer loads behind a high-resolution poster render of the same angle; the poster is the LCP image

**Treatment.** Headline in Space Grotesk 700 at clamp(2rem, 5vw, 4.75rem), body copy in Inter 400 at 18px, primary text #EAF0F6 on deep navy background, CTA in #00F5D4 with a visible focus ring in #EAF0F6

**On load.** Poster render displays immediately with fetchpriority high while the 3D viewer (e.g. `<model-viewer>` with a compressed glTF/GLB asset) hydrates and swaps in; kicker and headline fade in over 300ms, CTAs appear after 450ms. Reduced-motion users keep the static poster render with no auto-rotate and receive all elements at final opacity with no transform

**Atmosphere.** Deep navy surface with #1B263B used for structural rules and #00F5D4 reserved for small action highlights and HUD-style annotations, no gradient field

**Primary CTA.** Book a demo ride

**Mobile.** The 3D model stacks first at a reduced canvas height, text follows in a single column, CTAs span full width, and the sticky action appears only after the hero scrolls out; drag-to-rotate must not hijack vertical scroll

**The one thing they'll remember.** The visitor remembers every helmet ships with a printed calibration map of the rider's own field of view, because it appears in the hero, cards, icons, and footer motif without becoming decoration

## Sitemap (7 pages)

| Page | Route | Purpose | CTA |
| --- | --- | --- | --- |
| Home | `/` | Introduce HaloRide, the local hook, featured products, and the main action | Book a demo ride |
| Shop | `/shop` | Display the three helmet models side by side with a comparison of specs, prices, product detail links, and add-to-cart controls | Add to cart |
| Cart | `/cart` | Review selected products, quantities, delivery notes, and proceed to checkout | Checkout |
| Data Layers | `/layers` | Browse CMS-driven AR data layers with practical details and sample content | Book a demo ride |
| About | `/about` | Explain the Copenhagen origin story and why the hook matters | Read the story |
| Contact | `/contact` | Collect questions, show realistic contact details, social icons, legal links, and a crawlable Powered by Wix Headless footer | Send a note |
| Checkout | `/checkout` | Complete the Wix eCommerce purchase flow after cart review | Place order |

## Homepage flow

1. **Hero** - Lead with a strong H1, one practical subtitle, an interactive 3D helmet model beside the text, and a book a demo ride button plus a ghost shop link, repeated in a mobile sticky bar Image: Rotatable 3D model of the HaloRide helmet with a poster render fallback showing the visor and the printed calibration map on the inner shell
2. **Proof strip** - Use three compact facts such as 12 live data layers, 45-minute demo ride slots, and one named customer quote Image: Close-up detail of every helmet ships with a printed calibration map of the rider's own field of view beside a handwritten fitting note
3. **Offer grid** - Render a responsive CMS grid of data layers; each card includes a title, short description, battery cost or refresh rate, and one clear next action Image: Grid image showing several HUD layer examples rendered on the visor from the rider's perspective
4. **Signature detail** - Use one split section with a close photograph, a short origin note, and labels that help builders repeat the motif without decorative filler Image: Macro photograph of every helmet ships with a printed calibration map of the rider's own field of view
5. **Featured products** - Show the three helmet model cards with names, prices, short descriptions, add-to-cart buttons, and a link to /shop Image: The three HaloRide helmet models side by side with price tags and calibration cards
6. **Stories and samples** - Include named data layer samples, a short origin note, and one customer quote tied to the Copenhagen setting Image: Two riders comparing their printed calibration maps in natural light
7. **Trust and FAQ** - Pair four FAQ cards with one testimonial and small badges for safety certification, response time, and battery or booking clarity Image: Staff member fitting a visitor with an AR smart helmet
8. **Final CTA** - Use one short sentence, the book a demo ride button, and a secondary ghost link to Contact Image: Wide environmental photo of the HaloRide studio exterior or fitting room in Copenhagen
9. **Footer** - Footer includes hello@haloride.example, +45 31 62 84 07, 14 Cykelgade, Copenhagen 2200, Denmark, quick links to every main page, social icon links for https://instagram.example/haloride and https://tiktok.example/@haloride, Privacy Policy, Terms & Conditions, copyright © 2026 HaloRide, and a crawlable Powered by Wix Headless link to https://www.wix.com/lp-en/headless Image: No decorative image; use strong text hierarchy and icon links

## Content to create

Seed these into the CMS - counts and sample rows are the minimum bar.

- **3x Products** (on Shop) - fields: name, price, description, image, sku, inventoryStatus
  - e.g. HaloRide One — $489 — The commuter AR smart helmet with built-in visor display and speakers, shipped with every helmet ships with a printed calibration map of the rider's own field of view
  - e.g. HaloRide Pro — $689 — The road model with a wider-angle visor display, extended battery, and full sensor suite for long rides
  - e.g. HaloRide City — $389 — The entry model with the core speed, navigation, and hazard layers and a lighter shell
- **12x Data Layers** (on Data Layers) - fields: name, shortDescription, batteryCostOrRefreshRate, image, availability, featuredNote
  - e.g. Turn-by-turn layer — navigation arrows pinned to the road ahead, tagged with every helmet ships with a printed calibration map of the rider's own field of view
  - e.g. Hazard alert layer — a rider-ready entry with refresh rate, battery cost, and a concrete detail from Copenhagen cycle lanes
- **4x Testimonials** (on Home) - fields: quote, name, neighborhood, context
  - e.g. "The detail that sold me was seeing every helmet ships with a printed calibration map of the rider's own field of view" — Freja, Nørrebro
  - e.g. "Clear pricing, quick fitting, and the HUD sat exactly where the map said it would" — Anders, returning commuter

## Design system

**Aesthetic direction.** HUD-schematic minimal — a strong visual lane that turns every helmet ships with a printed calibration map of the rider's own field of view into the identity instead of using generic tech-product imagery

**Spatial composition.** Asymmetric desktop grid with one oversized documentary image, compact fact rails styled like HUD readouts, and card groups that become a strict single-column mobile stack

**Typography.** Display: `Space Grotesk` · Body: `Inter` · Display uses 700 for compressed impact; body stays 400-500 with generous line height for mobile reading *Source:* Google Fonts *Why:* Space Grotesk gives HaloRide a distinct instrument-panel presence while Inter keeps layer specs, forms, and FAQs easy to scan

**Color system** - paste into your Tailwind v4 `@theme`:

```css
@theme {
  --color-background: #0D1421;
  --color-surface: #141E30;
  --color-text: #EAF0F6;
  --color-text-muted: #8A97A8;
  --color-border: #263449;
  --color-primary: #1B263B;
  --color-accent: #00F5D4;
  --color-dark: #070C14;
  --color-on-dark: #EAF0F6;
}
```

**Signature device.** A small repeated reticle-and-grid marker based on every helmet ships with a printed calibration map of the rider's own field of view

**Motion.** CSS-first, low intensity: short fades, card hover lifts under 4px, a single HUD-style underline sweep on section headings, no scroll-jacking, all motion disabled by reduced-motion preference

**Imagery.** Documentary photos with visible hands, helmets, visors, workbenches, calibration rigs, and rider interactions; crop wide enough to prove the business is real Shoot every helmet ships with a printed calibration map of the rider's own field of view, the main HaloRide studio space in Copenhagen, staff fitting helmets, riders on cycle lanes, and at least two close-ups of the visor display

**Avoid in imagery.** abstract gradients · stock model poses · empty render-only product shots · decorative icons replacing real photos

## Conversion & forms

**Primary action.** Book a demo ride - via @wix/bookings + @wix/ecom + @wix/stores + @wix/data -&gt; `/contact`

**Repeat at.** hero · mid-page section · mobile sticky bar · footer

**Secondary (ghost).** Ask a question

**Form fields.** name, email, phone, preferred demo date, head circumference, riding style (commute / road / gravel), accessibility notes

**Success message.** Thanks — HaloRide will reply with the next available demo slot and your pre-ride calibration checklist

**Reassurance.** No payment is taken until the visitor confirms the fitted helmet after the demo ride

## FAQ

Real questions to answer on the site (and feed FAQPage JSON-LD).

**How far ahead should I book a demo ride?**

Most visitors choose a slot 3-7 days ahead; same-day requests are shown only when the calendar allows it

**Can I change my booking after submitting?**

Yes. The confirmation email includes an edit link and a direct reply address for small changes

**Where is HaloRide based?**

HaloRide operates from Copenhagen, Denmark, with contact details and visiting notes in the footer and Contact page

**Is the site usable on mobile?**

Yes. Buttons meet a 44px minimum tap target, forms use large fields, and motion has a reduced-motion alternative

## SEO

**Primary keyword.** AR smart bicycle helmet in Copenhagen

**Secondary.** Copenhagen cycling HUD · HaloRide data layers · Denmark smart helmet studio · heads-up display helmet

**Schema.org type.** `Store`

**JSON-LD per page.** Store (Home) · ItemList (Data Layers) · Product (Shop detail)

**Business facts.** Copenhagen · Tuesday-Saturday 10:00-18:00 · $$$ · est. 2024

**Differentiators.** every helmet ships with a printed calibration map of the rider's own field of view

**Socials.** @haloride · @haloride

## Performance & accessibility

**LCP element.** Hero 3D-model poster render (static image; the 3D viewer swaps in after hydration and never blocks LCP)

**Top moves.**

- Serve AVIF/WebP responsive images with explicit width and height
- Static-render CMS lists and hydrate only filters, the layer explorer, or cart controls
- Defer maps, video, and social embeds behind facades

**Hydration plan.**

- `Primary action widget` -&gt; `client:load` (Booking, cart, or inquiry state must be interactive immediately)
- `Hero 3D helmet viewer` -&gt; `client:idle` (Poster render carries LCP; the glTF asset and viewer script load after the main thread is free, and the asset stays under ~2MB compressed)
- `CMS filters / layer explorer` -&gt; `client:visible` (Filtering and the HUD explorer are useful after visitors reach the layers section)
- `Footer social icons` -&gt; `none` (Plain anchor links do not need JavaScript)

**Defer as facades.** map iframe · social feed · video testimonials

**Targets.** LCP &lt; 2.5s · INP &lt; 200ms · CLS &lt; 0.1 · Lighthouse mobile &gt;= 90

**Accessibility baseline.** Text contrast 4.5:1 · UI 3:1 · 44px tap targets · visible focus · honor reduced-motion · alt text required · semantic landmarks

---

# How to build this with Wix Headless

Internal Wix employees: run the setup skill first to configure npm registry and Wix login: https://github.com/hanag-wix/Headless-setup-skill-internal/blob/main/SKILL.md

Then follow the build skill for project setup, business solution wiring, and deployment: https://wix-headless.dev/skill.md

Build this using https://wix.com/headless/skill.md