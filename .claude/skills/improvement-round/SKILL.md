---
name: improvement-round
description: "Run one full competition-improvement round on this site: read competition-work-plan.md, measure the deployed site (Lighthouse, links, console, build), write a timestamped round plan, execute it, verify improvements, ship, and record results. Use when the user says: run an improvement round, improve the site, start an improvements round, next round, make the site better for the competition, or /improvement-round. Designed to be run repeatedly — every invocation produces its own uniquely timestamped plan."
---

# Improvement Round

You are a coding agent executing **one full improvement iteration** on this competition site. The guidelines live in `competition-work-plan.md` at the project root — that doc is the authority for *what matters and why* (judging funnel, targets, constraints). This skill is the *procedure* for one round. Rounds repeat: never assume this is the first or last one.

## Step 1 — Read the guidelines

1. Read `competition-work-plan.md` end to end — especially §3 (iteration protocol), the per-category targets (§4–§9), §10 (submission readiness), and §11 (round history — what previous rounds already did; don't redo finished work, do pick up their "next time" notes).
2. Read the most recent round file in `improvement-rounds/` (if any) for open follow-ups.

## Step 2 — Create THIS round's plan (uniquely timestamped)

1. Compute a timestamp: `date +%Y%m%d-%H%M` → e.g. `20260709-1430`. Create `improvement-rounds/round-<timestamp>.md`. **Never overwrite or reuse an existing round file.**
2. **Baseline first, plan second.** Measure the current deployed site per §3 of the work plan:
   - `yarn build` (must be green before and after).
   - Lighthouse mobile + desktop for `/`, `/shop`, `/blog`, `/bookings` against the production URL (`npx lighthouse <url> --preset=desktop ...` and default mobile; save reports into `improvement-rounds/round-<timestamp>-artifacts/`, which is gitignored if large).
   - Link/asset sweep (`npx linkinator <url> --recurse` or a curl sweep of every internal href/src).
   - Console errors via a browser tool on key pages, when a browser is available.
3. Write into the round file: baseline numbers (a table: page × category scores + CWV), the gaps vs the targets in the work plan, and a **prioritized action list of 3–7 items**, each with: which judging-funnel stage it serves, expected impact, and how it will be verified. Bias toward the weakest earliest funnel stage (review bot → like meter → experts → committee).

## Step 3 — Act on the plan and improve

1. Execute the actions one by one. Hard constraints (from the work plan §2 — do not violate):
   - `output: "export"` stays; no server rendering, no API routes.
   - Live Wix SDK data wiring stays intact (visitor OAuth client in `lib/wix.ts`).
   - Don't touch `wix.config.json`, `.yarnrc.yml`, `.claude/launch.json`.
2. After each action, keep the build green (`yarn build`). Check off the item in the round file as you go, noting what was actually done.
3. **Verify:** re-run the baseline measurements. Record before → after in the round file. A regression must be either fixed or explicitly justified there.
4. **Ship:** commit with a conventional message referencing the round file, push to `master` (Vercel auto-deploys), then confirm the deployment reached Ready and spot-check the live URL serves the change.
5. **Record:** finish the round file with: results table, learnings, and a short "next round should consider" list. Append one summary line to §11 *Round history* in `competition-work-plan.md`. If a durable guideline emerged (not round-specific), add it to the relevant section of the work plan.

## Guardrails

- One round = one timestamped plan = one coherent set of shipped improvements. Don't sprawl; unfinished ideas go to "next round should consider".
- Never ship with a broken build or failing verification — a failed review-bot gate loses the competition outright.
- If the production deploy is stale or failing at the start of the round, fixing the pipeline IS the round's first priority (§10 of the work plan).
- Ask the user before anything destructive or irreversible (deleting content, changing the submitted URL). Deploys to the existing Vercel project are part of the round and don't need a fresh ask.
