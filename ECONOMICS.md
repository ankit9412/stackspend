# ECONOMICS.md — StackSpend Unit Economics

> Numbers are estimates based on market research, Credex's positioning, and reasonable analogues from B2B SaaS consulting. Approximate inputs > no inputs.

---

## What a Converted Lead Is Worth to Credex

Credex sells SaaS cost optimization consulting. Based on the market for this kind of engagement:

| Engagement type | Deal size estimate | Basis |
|---|---|---|
| Project (one-time audit + implementation) | $4,000–$8,000 | ~20–40 hours at $200/hr blended rate |
| Retainer (ongoing optimization, 3–6 months) | $10,000–$25,000 | $2,000–$4,000/month × 3–6 months |
| **Conservative average deal size** | **$8,000** | Used in all calculations below |

A "converted lead" means: booked consultation → sales call → signed engagement.

**Lead value (expected revenue per lead):**
```
Close rate (lead → signed deal):    12%
Average deal size:                  $8,000
Expected value per lead:            $8,000 × 0.12 = $960
```

---

## Infrastructure Cost Structure

| Item | Monthly cost | Notes |
|---|---|---|
| MongoDB Atlas (M0 free tier) | $0 | 512MB; sufficient to ~500K audit documents |
| Render (backend, free tier) | $0 | Cold-start latency; upgrade at $7/mo |
| Vercel (frontend, Hobby) | $0 | Unlimited bandwidth for SPA |
| OpenRouter AI (free model) | $0 | `z-ai/glm-4.5-air:free` costs nothing |
| Domain + SSL | ~$1/mo | Annualized $12/year |
| **Total at launch** | **~$1/mo** | Near-zero infrastructure cost |
| **Total at scale (Render paid + Atlas M10)** | **~$65/mo** | Upgrades needed at ~50K audits/month |

**AI cost if using paid model (Claude 3.5 Sonnet via OpenRouter):**
```
~500 input tokens × $3/1M   = $0.0015
~150 output tokens × $15/1M = $0.00225
Per audit:                    ≈ $0.004
At 10,000 audits/month:       ≈ $40/month
```
Even at 10K audits, AI cost is negligible relative to a single consulting deal.

---

## CAC by Channel

| Channel | Estimated CAC | Basis |
|---|---|---|
| Hacker News "Show HN" | ~$0 | Time cost only; no paid spend |
| LinkedIn cold DM (personal) | ~$0 direct; ~2hr founder time | ~30 DMs/hour, 25% reply, 8% to lead |
| Reddit organic | ~$0 | Time only |
| Credex existing client list | ~$0 | Warm email to existing clients |
| Twitter thread | ~$0 direct; ~3hr content creation | Amplification depends on account size |
| **Blended CAC (all organic)** | **~$0 cash; ~5hr/lead in founder time** | At $100/hr opportunity cost = ~$500/lead |

At $960 expected value per lead and ~$500 in time cost: **margin per lead ≈ $460** even valuing founder time generously.

Once there's any paid budget: LinkedIn Ads targeting "Engineering Manager" at SaaS companies typically runs $8–15/click. At 5% audit completion and 8% lead conversion: $8 × 250 audits/lead = **$2,000 CAC via paid**. Still profitable at $8,000 deal size.

---

## Conversion Funnel Math

```
Visitor → Audit Started → Audit Completed → Lead Captured → Consultation → Deal

Step               Rate        Volume (from 1,000 visitors)
─────────────────────────────────────────────────────────────
Visitors           100%        1,000
Audit started       35%          350   (landing page → form)
Audit completed     60%          210   (form completion)
Lead captured        8%           17   (modal → email submitted)
Consultation         50%           8   (lead → booking)
Deal closed          12%           1   (close rate)

Revenue per 1,000 visitors:    1 deal × $8,000 = $8,000
Infra cost per 1,000 visitors: ~210 audits × $0.004 = ~$0.84
Net per 1,000 visitors:        ≈ $7,999
```

**The bottleneck is audit→lead conversion (8%).** Every 1pp improvement in that rate = +$1,000 in expected revenue per 1,000 visitors. Optimization priority: lead modal copy, timing, and the savings threshold trigger.

---

## What Would Have to Be True for $1M ARR in 18 Months

$1M ARR = $83,333/month in consulting revenue.

At $8,000 average deal and ~6-month average engagement:
```
$83,333/month ÷ $8,000/deal = ~10.4 new deals/month
```

Working backward through the funnel:
```
10.4 deals/month
÷ 0.12 close rate        = 87 consultations/month
÷ 0.50 show rate         = 174 leads/month
÷ 0.08 audit→lead rate   = 2,175 audits/month
÷ 0.60 completion rate   = 3,625 audit starts/month
÷ 0.35 landing→start     = 10,357 visitors/month
```

**So $1M ARR requires ~10,000 unique monthly visitors at our current funnel rates.**

10,000 visitors/month is achievable by month 6–12 through:
- SEO: 3 long-tail articles ranking ("cursor vs copilot cost", "chatgpt team vs enterprise", etc.)
- Compounding share-link virality (each audit generates 0.3–0.5 new users via sharing)
- One major distribution event (Product Hunt launch, viral Twitter thread, or HN front page)

**What would have to be true:**
1. Funnel conversion holds at or above 8% audit→lead (requires good modal copy + genuine savings output)
2. Sales close rate holds at 12% (requires qualified leads — EM/CTO/CFO titles, not individual devs)
3. Average deal size holds at $8,000 (requires Credex to pitch retainers, not one-offs)
4. Traffic reaches 10K/month by month 9 (requires SEO + consistent distribution)

**Sensitivity check:** If deal size drops to $5,000 (more one-time audits, fewer retainers), $1M ARR needs 200 deals — roughly double the visitors. The retainer model is the key lever.

---

## 18-Month Revenue Projection (Conservative)

| Month | Monthly visitors | Audits | Leads | Deals closed | Monthly revenue |
|---|---|---|---|---|---|
| 1–2 | 2,000 | 420 | 34 | 0.4 × $8K | ~$3,200 |
| 3–4 | 4,000 | 840 | 67 | 0.8 × $8K | ~$6,400 |
| 5–6 | 6,000 | 1,260 | 101 | 1.2 × $8K | ~$9,600 |
| 7–9 | 8,500 | 1,785 | 143 | 1.7 × $8K | ~$13,600 |
| 10–12 | 12,000 | 2,520 | 202 | 2.4 × $8K | ~$19,200 |
| 13–18 | 18,000 | 3,780 | 302 | 3.6 × $8K | ~$28,800 |

**Cumulative 18-month revenue (conservative):** ~$480,000

Hitting $1M ARR by month 18 requires the upper end of traffic growth AND retainer conversion. Realistic ceiling in 18 months: $400K–$700K in consulting revenue, with $1M ARR as the stretch target requiring one breakout distribution event.
