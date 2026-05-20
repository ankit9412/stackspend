import { motion } from 'framer-motion';
import { TrendingDown, ArrowRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { REC_TYPE_LABELS, TOOLS } from '../../utils/toolData';
import { cn } from '../../lib/utils';

const TYPE_ICONS = {
  downgrade:   TrendingDown,
  alternative: Lightbulb,
  redundancy:  AlertTriangle,
};

export default function RecommendationCard({ rec, index }) {
  const meta   = REC_TYPE_LABELS[rec.type] || REC_TYPE_LABELS.alternative;
  const Icon   = TYPE_ICONS[rec.type] || Lightbulb;
  const tool   = TOOLS[rec.toolId];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      className={cn(
        'card-glass border-l-4 p-5 rounded-2xl',
        rec.type === 'downgrade'   && 'border-l-brand-500',
        rec.type === 'alternative' && 'border-l-accent-500',
        rec.type === 'redundancy'  && 'border-l-amber-500',
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {tool && (
            <span className="text-xl shrink-0 mt-0.5">{tool.emoji}</span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', meta.color, meta.bg, meta.border)}>
                {meta.label}
              </span>
              {rec.confidence === 'high' && (
                <span className="text-[10px] text-accent-400 font-semibold">● High confidence</span>
              )}
            </div>
            <h3 className="text-sm font-semibold text-white leading-snug">{rec.title}</h3>
          </div>
        </div>

        {/* Savings badge */}
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-accent-400">{formatCurrency(rec.monthlySavings)}</p>
          <p className="text-[10px] text-gray-500">/month</p>
        </div>
      </div>

      {/* Plan comparison */}
      {rec.fromPlan && rec.toPlan && (
        <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 flex-wrap">
          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono">
            {rec.fromPlan}
          </span>
          <ArrowRight className="w-3 h-3 text-gray-600 shrink-0" />
          <span className="px-2 py-1 rounded-md bg-accent-500/10 border border-accent-500/20 text-accent-300 font-mono">
            {rec.toPlan}
          </span>
        </div>
      )}

      {/* Explanation */}
      <p className="text-xs text-gray-400 leading-relaxed">{rec.explanation}</p>

      {/* Yearly savings */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={cn('w-3.5 h-3.5', meta.color)} />
          <span className="text-xs text-gray-500">Annual impact</span>
        </div>
        <span className="text-sm font-semibold text-white">
          {formatCurrency(rec.yearlySavings)}/yr saved
        </span>
      </div>
    </motion.div>
  );
}
