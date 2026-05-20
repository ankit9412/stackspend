import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Zap, ShieldCheck, BarChart3, Lightbulb,
  TrendingDown, ChevronDown, Star, CheckCircle2,
} from 'lucide-react';


// Animation helpers
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div {...fadeUp(0)} className="mb-6">
          <span className="section-tag">
            <Zap className="w-3 h-3" />
            Free AI Spend Audit Tool
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6"
        >
          Stop Overpaying for
          <span className="block text-gradient"> AI Tools</span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          StackSpend analyzes your AI tool subscriptions and surfaces exactly where you're
          overspending — with concrete downgrade paths, cheaper alternatives, and real dollar savings.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/audit" id="hero-cta" className="btn-primary text-base px-8 py-4 shadow-glow">
            Run Your Free Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-6 py-4">
            See How It Works
          </a>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
        >
          {['2 min setup', 'No credit card', 'Instant results', '100% free'].map(label => (
            <div key={label} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating savings preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 max-w-lg mx-auto card-glass p-6 rounded-2xl shadow-glow text-left"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Sample Audit Result</p>
              <p className="text-2xl font-bold text-white">$1,140<span className="text-gray-500 text-sm font-normal">/year saved</span></p>
            </div>
            <span className="badge-savings text-sm px-3 py-1.5">↓ 47% less</span>
          </div>
          <div className="space-y-2.5">
            {[
              { tool: '💬 ChatGPT Team (2 seats)', rec: '→ Plus plan', saving: '$10/mo' },
              { tool: '🐙 Copilot Enterprise', rec: '→ Business plan', saving: '$40/mo' },
              { tool: '🖱️ Cursor + 🐙 Copilot', rec: 'Duplicate tools', saving: '$45/mo' },
            ].map(row => (
              <div key={row.tool} className="flex items-center justify-between text-xs">
                <span className="text-gray-400">{row.tool}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">{row.rec}</span>
                  <span className="text-accent-400 font-semibold">{row.saving}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: BarChart3,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    title: 'Instant Spend Analysis',
    desc: 'Enter your tools and plans. Get a complete breakdown of where every dollar goes — in under 2 minutes.',
  },
  {
    icon: TrendingDown,
    color: 'text-accent-400',
    bg: 'bg-accent-500/10',
    title: 'Downgrade Recommendations',
    desc: 'Our rule engine flags plans that are overkill for your team size. Every recommendation is finance-reasoned.',
  },
  {
    icon: Lightbulb,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    title: 'Cheaper Alternatives',
    desc: 'Discover lower-cost tools with equivalent capabilities — with data-backed comparisons, not guesswork.',
  },
  {
    icon: ShieldCheck,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    title: 'Redundancy Detection',
    desc: 'Paying for Cursor AND GitHub Copilot? We surface tool overlaps so you can consolidate confidently.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.div {...fadeUp()} className="section-tag mb-4 mx-auto w-fit">Why StackSpend</motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Everything you need to <span className="text-gradient">cut AI costs</span>
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-gray-400 max-w-xl mx-auto">
            A complete spend intelligence layer for teams running modern AI workflows.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} {...fadeUp(i * 0.08)} className="card-glass p-6 rounded-2xl group hover:border-white/15 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Add your AI tools', desc: 'Select from 8 supported tools including ChatGPT, Claude, Cursor, GitHub Copilot, and more.' },
  { num: '02', title: 'Enter plan details', desc: 'Choose your current plan, number of seats, and monthly spend for each tool.' },
  { num: '03', title: 'Get instant analysis', desc: 'Our rule engine audits your stack in milliseconds and generates a prioritized savings report.' },
  { num: '04', title: 'Implement & save', desc: 'Follow our finance-reasoned recommendations or book a free Credex consultation.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 bg-surface-800/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.div {...fadeUp()} className="section-tag mb-4 mx-auto w-fit">Process</motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-4xl font-bold text-white">
            How it works
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div key={step.num} {...fadeUp(i * 0.1)} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[calc(100%_-_12px)] w-full h-px bg-gradient-to-r from-brand-600/40 to-transparent" />
              )}
              <div className="card-glass p-6 rounded-2xl h-full">
                <div className="text-3xl font-display font-bold text-brand-500/30 mb-3">{step.num}</div>
                <h3 className="text-sm font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "StackSpend found $480/month in savings in under 2 minutes. We had no idea we were paying for GitHub Copilot Enterprise when Business covered everything we used.",
    name: 'Priya Menon',
    role: 'CTO, Siftly',
    avatar: 'PM',
    stars: 5,
  },
  {
    quote: "The duplicate tool detection is brilliant. We were running Cursor AND Copilot for the same team. That's $57/month we were just burning.",
    name: 'Alex Roth',
    role: 'Engineering Lead, Codeframe',
    avatar: 'AR',
    stars: 5,
  },
  {
    quote: "As a finance lead, I love that every recommendation has a clear financial explanation. It's not just 'switch tools' — it tells you exactly why.",
    name: 'Samira Osei',
    role: 'VP Finance, Trellis AI',
    avatar: 'SO',
    stars: 5,
  },
];

function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div {...fadeUp()} className="section-tag mb-4 mx-auto w-fit">Testimonials</motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-4xl font-bold text-white">
            Loved by finance & eng teams
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(i * 0.1)} className="card-glass p-6 rounded-2xl flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-xs font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{t.name}</p>
                  <p className="text-[11px] text-gray-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is StackSpend really free?', a: 'Yes. The audit tool is completely free. We monetize through Credex consulting engagements for teams that want expert help implementing changes.' },
  { q: 'How accurate are the recommendations?', a: 'All recommendations use deterministic, finance-reasoned rules based on official pricing data. We flag the confidence level for each recommendation so you always know how certain we are.' },
  { q: 'Does StackSpend use AI to make decisions?', a: 'No. The audit logic is 100% rule-based. AI (Claude 3.5 Sonnet) is only used to write the executive summary paragraph at the end — and even that has a fallback.' },
  { q: 'What tools are supported?', a: 'ChatGPT, Claude, Gemini, Cursor, GitHub Copilot, Windsurf, OpenAI API, and Anthropic API. More coming soon.' },
  { q: 'Is my data private?', a: 'Your audit data is stored anonymously with a unique share ID. We only collect your email if you explicitly submit the consultation form. Audits auto-expire after 90 days.' },
  { q: 'Can I share my results?', a: 'Yes! Every audit generates a unique public URL you can share with your team or CFO.' },
];

function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 bg-surface-800/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div {...fadeUp()} className="section-tag mb-4 mx-auto w-fit">FAQ</motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display text-4xl font-bold text-white">
            Frequently asked questions
          </motion.h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.details
              key={faq.q}
              {...fadeUp(i * 0.05)}
              className="card-glass rounded-xl group"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
                <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ─────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <motion.div
        {...fadeUp()}
        className="max-w-3xl mx-auto text-center card-glass rounded-3xl p-12"
        style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)' }}
      >
        <div className="text-5xl mb-4">💸</div>
        <h2 className="font-display text-4xl font-bold text-white mb-4">
          Find out how much you're <span className="text-gradient">overpaying</span>
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Takes 2 minutes. No account needed. Instant results with actionable savings.
        </p>
        <Link to="/audit" id="bottom-cta" className="btn-primary text-base px-8 py-4 shadow-glow">
          Run My Free Audit
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTABanner />
    </main>
  );
}
