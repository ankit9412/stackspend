# DEVLOG.md — StackSpend Development Log

---

## Day 1 — 2026-05-14

**Hours worked:** 6

**What I did:**
Kicked off the project. Started by mapping out what the audit engine actually needed to do — realized fast that if I let an LLM generate the recommendations I'd have no way to guarantee the numbers were right. So I committed early to a deterministic rule engine and clear separation from any AI layer. Scaffolded the MERN stack: Express server, MongoDB Atlas connection, Mongoose Audit and Lead schemas, basic `/api/audit` route. Wrote `pricingData.js` from scratch — pulled every price from official vendor pages and verified against live pricing pages for ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and Windsurf.

**What I learned:**
GitHub Copilot Enterprise is $39/seat — I initially had $49 from a stale blog post. Always go to the vendor page directly. Also learned that Windsurf (Codeium) rebranded their plan names recently; older sources call "Teams" by a different name.

**Blockers / what I'm stuck on:**
Nothing blocking yet. Slightly unsure whether to embed recommendations in the Audit document or use a separate collection. Will decide tomorrow.

**Plan for tomorrow:**
Write the full audit rule engine with all per-tool and cross-tool rules. Get to a point where `runAudit()` returns real savings numbers.

---

## Day 2 — 2026-05-15

**Hours worked:** 8

**What I did:**
Built the full `auditEngine.js` — 9 per-tool rules and 2 cross-tool redundancy rules. The deduplication logic (keep highest-savings rec per toolId) took longer than expected because cross-tool rules don't naturally belong to a single toolId. Solved it by using `rec.toolId || rec.title` as the dedup key. Wrote the first batch of Jest tests (8 test cases) to validate each rule branch. All green on first run — the pure function design made testing trivial, no mocking needed. Decided to embed recommendations in the Audit document (no separate collection) since the read pattern is always "give me the full audit" anyway.

**What I learned:**
The deduplication issue revealed a design smell: cross-tool redundancy recommendations need a stable key that isn't tool-specific. Using the recommendation title as a fallback key works but is fragile. For v2, I'd use a `ruleId` field on every recommendation.

**Blockers / what I'm stuck on:**
OpenRouter model selection — the free-tier model (`z-ai/glm-4.5-air:free`) returns reasoning tokens that inflate `max_tokens` usage. Had to bump to 800 to avoid cut-off summaries.

**Plan for tomorrow:**
Wire up the AI summary service, integrate into the audit controller, add the share endpoint, and start the frontend.

---

## Day 3 — 2026-05-16

**Hours worked:** 7

**What I did:**
Built `aiSummary.js` with the OpenRouter integration and a deterministic fallback. The fallback was important — discovered during testing that if `OPENROUTER_API_KEY` isn't set, the whole audit crashed instead of gracefully degrading. Fixed with an early-return guard. Added the `GET /api/share/:shareId` endpoint — strips `ipHash` and `leadEmail` before sending. Added `POST /api/leads` with email-unique upsert. Set up Helmet, CORS with env-based origin whitelist, and two rate limiters (global 100/15min, AI summary 20/hr). Started the frontend: Vite + React 19 + Tailwind v4 + Framer Motion scaffolded. Landing page skeleton up.

**What I learned:**
Tailwind v4 dropped the `@tailwind components` directive — it caused a silent build failure in Vite. The error message didn't point to Tailwind at all; it looked like a PostCSS issue. Spent 40 minutes on this.

**Blockers / what I'm stuck on:**
Tailwind v4 config is meaningfully different from v3. The `tailwind.config.js` approach is replaced by CSS-first config with `@theme`. Had to reread the v4 docs carefully.

**Plan for tomorrow:**
Build the audit form (3-step tool selector), Zustand store with localStorage persistence, and the results page.

---

## Day 4 — 2026-05-17

**Hours worked:** 9

**What I did:**
This was the heaviest frontend day. Built the Zustand store with `persist` middleware — form state survives page refresh, result state does not. Built the 3-step audit form: step 1 = tool selector grid, step 2 = plan/seat config for each selected tool, step 3 = use case + team size. Built the results page with Recharts bar chart (current vs optimized spend), recommendation cards with savings badges, and the AI summary card. Implemented the `useAudit` hook for clean separation of the API call from UI state. Added the share button with clipboard copy.

**What I learned:**
Framer Motion's `AnimatePresence` with `mode="wait"` is the cleanest way to animate between form steps. Took one read of the docs to get it right. Recharts needs explicit `ResponsiveContainer` width/height or it collapses to zero on mount — caught this with browser dev tools.

**Blockers / what I'm stuck on:**
The shared audit page (`/share/:shareId`) needs to fetch from the API on mount and render the same ResultsPage. Slightly tricky because ResultsPage was built assuming Zustand state, not fetch-on-load. Will refactor tomorrow.

**Plan for tomorrow:**
Build shared page, add lead capture modal, connect CI, polish UI.

---

## Day 5 — 2026-05-18

**Hours worked:** 7

**What I did:**
Refactored ResultsPage to accept data either from Zustand store or from a prop (for shared view). Built the SharedPage that fetches `/api/share/:shareId` on mount and renders ResultsPage in read-only mode. Built the lead capture modal — fires after results render, has a 3-second delay so users can see savings first. The modal collects name + email + company size, posts to `/api/leads`. Wired up GitHub Actions CI: backend job (lint + Jest), frontend job (lint + Vite build). Both green. Added `.env.example` files for both packages. Ran through the full audit flow end-to-end: form → results → share link → shared view. All working.

**What I learned:**
The 3-second delay before showing the lead modal was a deliberate choice after noticing that immediate modals feel aggressive. Letting users read their savings first makes the consultation offer feel earned, not pushy.

**Blockers / what I'm stuck on:**
Vite build on CI needed `VITE_API_URL` as an env var even for a static build — otherwise it bakes in `undefined`. Added it to the CI workflow with a placeholder prod URL.

**Plan for tomorrow:**
Polish landing page copy, write all documentation files, prep for deployment.

---

## Day 6 — 2026-05-19

**Hours worked:** 5

**What I did:**
Landed on Vercel (frontend) and Render (backend). Had to set `FRONTEND_URL` in Render env vars to unblock CORS — obvious in retrospect but bit me for 20 minutes when the deployed frontend got CORS errors. Fixed the MongoDB connection string (needed `+srv` format for Atlas, had a plain URI). Added the `nanoid` share ID generation in the Audit controller. Did a full end-to-end test on deployed URLs — audit runs, share link works, lead capture fires. Wrote README, ARCHITECTURE, PRICING_DATA, PROMPTS, and TESTS documentation. Added 8 more test cases to bring the suite to 16 total (covering all rule boundaries).

**What I learned:**
Render's free tier spins down after 15 minutes of inactivity and takes ~30 seconds to cold-start. This is a bad UX for a tool where the first impression matters. The fix for production is a simple uptime ping (UptimeRobot free tier) or a Render paid plan ($7/mo).

**Blockers / what I'm stuck on:**
`USER_INTERVIEWS.md`, `REFLECTION.md`, `GTM.md`, and `ECONOMICS.md` need real thought and real conversations — not copy-paste. Blocking time tomorrow for this.

**Plan for tomorrow:**
Write entrepreneurial files, run user interviews, finalize everything.

---

## Day 7 — 2026-05-20

**Hours worked:** 6

**What I did:**
Conducted three user interviews (cold DMs to founders in my network + one Indie Hackers Slack). Wrote `USER_INTERVIEWS.md` from actual notes. Wrote `REFLECTION.md` with honest answers to all 5 questions. Expanded `GTM.md` and `ECONOMICS.md` with specific numbers and channel reasoning. Did a final review of the CI workflow — both backend and frontend jobs passing green. Verified all pricing sources in `PRICING_DATA.md` against live vendor pages. Pushed final commit. Submitted.

**What I learned:**
The most surprising thing from user interviews: none of the three people I spoke to knew their exact AI spend. Two of them said they'd approved "some Cursor and ChatGPT licenses" but couldn't give me a number without checking Stripe. That's the real pain this tool solves — not just overspend, but *visibility*.

**Blockers / what I'm stuck on:**
Nothing blocking. Shipped.

**Plan for tomorrow:**
Post on Hacker News ("Show HN"), share in r/SaaS and relevant Discord communities, monitor for first real audit runs.
