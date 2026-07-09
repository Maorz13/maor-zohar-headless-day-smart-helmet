# Headless Day — Competition Work Plan

**Purpose:** This is a *guidelines document* for recurring improvement iterations on this site — not a one-shot checklist. Each improvement round reads this doc, measures the site's current state, picks the highest-impact actions, executes them, and records results. Run it as many times as needed; the guidelines below stay stable while the per-round plans (timestamped) change.

---

## 1. Competition context (source: manage.wix.com/headless-builder-funnel/headless-day)

- **Event:** Wix Headless Day — "1000 sites. One day." Prize: MacBook Neo.
- **Goal per the organizers:** "how you utilize Wix Headless and our Business Solutions to power the frontend … while creating the most creative websites."
- **Deadlines:** Submit **1 website by 7pm July 9** (system stays open until July 18). Winners announced **July 20**.
- **Submission requires:** Site Name, Site ID (`b89957c0-aef4-4c5e-ad33-d0ae1b412866`), Site URL, **public GitHub repo with all project files** (https://github.com/Maorz13/maor-zohar-headless-day-smart-helmet), business-solution tags (we have: Stores, Bookings, Blog, CMS/FAQs).
- **Support:** Slack `#headless-day-26`, design support `#headless-day-design-support`.

### The judging funnel — optimize for each stage in order

| Stage | Who/what judges | What wins it |
|---|---|---|
| 1. **Review bot** | Automated agent: **page speed, broken links, "and more"** | Technical hygiene: fast Lighthouse scores, zero broken links/images, no console errors, valid pages. This is a *gate* — fail here and nothing else matters. |
| 2. **Like meter** | Crowd votes in the public gallery | First impression: striking hero, beautiful thumbnail/OG image, instant visual identity, fast first paint. Voters spend seconds, not minutes. |
| 3. **Studio experts** | Designers review top 50 one-by-one | Craft: typography, spacing, color system, motion, responsive polish, coherent art direction, creativity. |
| 4. **Headless committee** | Final: top 10 → 3 winners | Depth of **Wix Business Solutions integration** powering a creative frontend — real store/bookings/blog/CMS flows, not decoration. |

---

## 2. The site

- **Product:** HaloRide smart helmet — landing page with 3D model viewer (`<model-viewer>` + GLB), shop (Wix Stores catalog v3, cart → hosted checkout), bookings (3 appointment services with live availability + booking flow), blog (4 posts, Ricos rendering), FAQs (Wix CMS `FAQs` collection).
- **Stack:** Next.js 16 (App Router, static export `output:"export"`, all Wix data client-side via `@wix/sdk` visitor OAuth), Tailwind v4, shadcn/ui.
- **Hosting:** Vercel project `maor-zohar-headless-day-smart-helmet` (auto-deploys from GitHub `master`). A Wix-hosted copy exists (`https://headless-d-ed93e9e8-maorz5.wix-site-host.com`) but is **stale** (starter page — pre-dates the smart-helmet build). Decide per round which URL is the submission URL and keep it fresh.
- **Constraint:** static export — no server rendering, no API routes, no `auth.elevate`. Data appears only after client JS runs (this hurts LCP/SEO if unmanaged — see §4/§5).

---

## 3. Iteration protocol (every improvement round follows this)

1. **Baseline** — measure before touching anything:
   - `yarn build` must be green.
   - Lighthouse (mobile + desktop) against the **deployed** production URL: `npx lighthouse <url> --output=json --output=html --output-path=<round-dir>/lh-<page>` for `/`, `/shop`, `/blog`, `/bookings`. Record all 4 category scores per page.
   - Broken links/assets: crawl all internal links + image/script/model URLs (a simple `curl` sweep or `npx linkinator <url> --recurse`).
   - Console errors: load key pages in a browser tool and read the console.
2. **Prioritize** — pick 3–7 actions with the best (impact on judging funnel) ÷ (effort) ratio, biased toward the earliest funnel stage that's currently weakest. Never start work without the baseline saying *why* these actions.
3. **Execute** — implement. Keep static-export compatibility and live Wix data wiring intact.
4. **Verify** — `yarn build` green; re-run the baseline measurements; confirm every score moved the right way (or explicitly note regressions and why they're accepted).
5. **Ship** — commit (conventional message), push to `master` (auto-deploys on Vercel), confirm deployment is Ready and the live URL serves the new build.
6. **Record** — append results (before/after scores, what worked, what to try next) to the round file. Feed durable learnings back into this doc's guidelines.

---

## 4. Performance (Lighthouse) guidelines — review-bot stage

Targets: **Performance ≥ 95 mobile / ≥ 99 desktop** on every page. Watch LCP < 2.5s, CLS < 0.1, TBT < 200ms, INP < 200ms.

- **LCP:** The hero must not wait for JS. Hero text + backdrop should be static HTML/CSS from the export. Preload the hero font/image if any. The 3D model viewer must stay lazy (idle-callback load — already in place) and never be the LCP element.
- **Payload:** Keep the GLB (3.7 MB) and `model-viewer.min.js` (936 KB) out of the critical path — lazy, `fetchpriority=low`, after-interaction if possible. Audit route JS with `next build` output; dynamic-import heavy components (Ricos renderer, booking flow) so list pages stay light.
- **Client-side data (Wix SDK):** every fetch needs a skeleton sized to the final layout (prevents CLS). Consider build-time snapshots for content that judges see first (see §5 SEO note) with client-side revalidation.
- **Images:** any future imagery → responsive sizes, modern formats, `loading=lazy` below the fold, explicit width/height. Wix media via `media.getScaledToFillImageUrl` at the rendered size, not the original.
- **Fonts:** self-host/`next/font`, `display: swap`, subset.
- **Third-party:** none unless it earns its cost. No analytics blobs during the contest.

## 5. SEO guidelines — review bot + discoverability

Target: **Lighthouse SEO = 100** every page.

- Unique `<title>` + meta description per route (Next `metadata` export per page).
- **Open Graph / Twitter card + a designed OG image** — this likely doubles as the gallery thumbnail → directly feeds the like-meter stage. Make it stunning.
- `robots.txt` + `sitemap.xml` in `public/` listing all routes.
- Semantic structure: one `<h1>` per page, logical heading order, landmark elements.
- Structured data (JSON-LD): `Product` for helmet products (price, availability), `BlogPosting` for posts, `Service`/`LocalBusiness` for bookings, `FAQPage` for the FAQs. All content the crawler can't see via client-side JS should at minimum exist as static text baked at build time — the static export renders only skeletons for SDK data, so **bake critical content (product names/prices, post titles/excerpts, FAQ text) into the HTML at build time** where feasible and hydrate live on top.
- Canonical URLs; no dead anchors; descriptive link text (also feeds the broken-links bot check).

## 6. Accessibility guidelines

Target: **Lighthouse A11y = 100** + a manual axe pass (`npx @axe-core/cli <url>`).

- Color contrast ≥ 4.5:1 for text (check Tailwind palette against dark/light hero sections).
- Every interactive element keyboard-reachable with a visible focus style; logical tab order; skip-to-content link.
- `alt` text on all images; `aria-label` on icon-only buttons (cart, nav toggle); the 3D viewer needs an accessible name + text alternative.
- Forms (booking flow): labels bound to inputs, error messages announced (`aria-live`), required fields marked.
- Respect `prefers-reduced-motion` for all animation/parallax/3D auto-rotate.
- Semantic HTML first (nav/main/footer/button, not div-soup); heading hierarchy without gaps.

## 7. Design / creativity guidelines — expert + committee stages

- **Art direction:** one confident visual identity (typography pairing, spacing scale, a signature accent color, consistent radii/shadows). The smart-helmet theme should feel like a real product launch, not a template.
- **Hero:** the 3D helmet is the differentiator — make the first viewport unforgettable (but never at LCP's expense: static poster first, 3D enhances after load).
- **Motion:** purposeful micro-interactions (scroll reveals, hover states, view transitions); all gated by `prefers-reduced-motion`.
- **Responsive:** flawless at 360px, 768px, 1440px, 1920px. Test the 3D viewer and tables/grids on mobile explicitly.
- **Dark/light:** if supporting both, both must be polished; otherwise commit to one.
- **Empty/loading/error states** are designed, not default — judges will hit them while data loads.
- **Details judges notice:** favicon set, custom 404, page transitions, selection color, scrollbar styling, print of the little things.

## 8. Wix Business Solutions depth — committee stage

The winning criterion is *"utilize Wix Headless and Business Solutions to power the frontend."* Every solution should visibly do real work:

- **Stores:** product options/variants shown, real add-to-cart → hosted checkout round trip works end-to-end; consider compare-at pricing, inventory hints ("only 3 left" via live data).
- **Bookings:** live availability slots render; a booking can actually be completed; show duration/price from the API.
- **Blog:** posts render full rich content; dates/read time; internal links between posts and products (cross-selling content → shop).
- **CMS (FAQs):** live collection drives the accordion; consider a second creative use of CMS (e.g. spec sheets, testimonials) — more visible "powered by Wix Data."
- Show provenance subtly: the frontend obviously reflects dashboard changes (a judge-facing README section + demo notes help the committee see the integration depth).
- **README.md** in the public repo: architecture diagram, which Wix APIs power what, how to run — experts and committee will look at the repo.

## 9. Technical hygiene — review-bot "and more"

- Zero console errors/warnings on any page.
- No broken internal/external links, no 404 assets (the bot checks this explicitly).
- Valid HTML (`lang` attr, charset, viewport), HTTPS-only assets, no mixed content.
- `yarn build` with zero type errors; no ESLint errors.
- Custom 404 page; all nav routes resolve in the static export.
- The deployed URL, the submitted Site URL, and the GitHub repo must all be consistent and current at submission time.

## 10. Submission readiness (check every round until submitted)

- [ ] Production deploy is green and serves the latest build (Vercel: `vercel ls`).
- [ ] Submission URL decided (Vercel URL vs Wix-hosted — whichever is submitted must be the polished one; the Wix-hosted copy is currently stale).
- [ ] GitHub repo is public and complete (`git status` clean, pushed).
- [ ] Site ID `b89957c0-aef4-4c5e-ad33-d0ae1b412866` + business-solution tags (Stores, Bookings, Blog, CMS) ready for the form.
- [ ] Submitted before the deadline (7pm July 9 for the prize track; hard close July 18).

---

## 11. Round history

*(Each improvement round appends a line here: round file, date, headline before→after numbers.)*
