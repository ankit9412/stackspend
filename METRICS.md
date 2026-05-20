# METRICS.md — StackSpend Success Metrics

## North Star Metric

**Weekly audits run** — the single number that best reflects product value delivery.

---

## Acquisition Metrics

| Metric | Definition | Target (Month 1) |
|---|---|---|
| Unique visitors | Sessions to stackspend.app | 2,000 |
| Audit start rate | Visitors who click "Run Audit" | ≥ 40% |
| Audit completion rate | Started → submitted | ≥ 70% |
| Total audits run | Completed audits | ≥ 500 |

---

## Activation Metrics

| Metric | Definition | Target |
|---|---|---|
| Results page view | User reached /results | ≥ 90% of completions |
| Avg recommendations shown | Per completed audit | ≥ 2.5 |
| Avg monthly savings found | Per audit | ≥ $80 |
| Share link generated | Audits with share click | ≥ 15% |

---

## Revenue / Lead Metrics

| Metric | Definition | Target |
|---|---|---|
| Lead capture rate | Results viewers → lead form | ≥ 8% |
| Lead quality score | Leads with company + role filled | ≥ 60% |
| Sales call booking rate | Leads → Credex call booked | ≥ 25% |
| Audit → revenue conversion | Audits that become paid deals | ≥ 0.5% |

---

## Retention Metrics

| Metric | Definition | Target |
|---|---|---|
| Return audit rate | Users who run 2nd audit | ≥ 20% (Month 2) |
| Share link click-throughs | Shared audits that get views | ≥ 30% |

---

## Technical Health Metrics

| Metric | SLA |
|---|---|
| API p95 response time | < 2000ms |
| Audit endpoint success rate | ≥ 99% |
| AI summary success rate | ≥ 85% (fallback covers rest) |
| Frontend core web vitals (LCP) | < 2.5s |
| Uptime | ≥ 99.5% |

---

## Analytics Setup

### Google Analytics 4 Events to Track

```js
// Audit started
gtag('event', 'audit_started', { tool_count: n })

// Audit completed
gtag('event', 'audit_completed', {
  tool_count: n,
  monthly_savings: amount,
  rec_count: n,
})

// Share link clicked
gtag('event', 'share_clicked', { share_id: id })

// Lead form submitted
gtag('event', 'lead_submitted', { has_company: bool })

// Results page CTA clicked
gtag('event', 'cta_clicked', { cta_location: 'results' })
```

---

## Weekly Review Template

```
Week of: ___________

Audits run:      ___
Leads captured:  ___
Avg savings:     $___
Top traffic src: ___
Conversion rate: ___%
Calls booked:    ___

Notable observations:
-

Next week priority:
-
```
