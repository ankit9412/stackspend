import { TOOLS } from '../../utils/toolData';
import { formatCurrency } from '../../lib/utils';

const PALETTE = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

// ── Donut chart (pure SVG) ─────────────────────────────────────────────────
export function SpendBreakdownPie({ toolsAudited }) {
  const data = toolsAudited
    .filter(t => t.effectiveCost > 0)
    .map((t, i) => ({
      name: TOOLS[t.toolId]?.name || t.toolId,
      value: t.effectiveCost,
      color: PALETTE[i % PALETTE.length],
    }));

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 100, cy = 100, r = 72, innerR = 44;
  let angle = -Math.PI / 2;

  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const ix1 = cx + innerR * Math.cos(angle - sweep);
    const iy1 = cy + innerR * Math.sin(angle - sweep);
    const ix2 = cx + innerR * Math.cos(angle);
    const iy2 = cy + innerR * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return {
      ...d,
      path: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${innerR},${innerR} 0 ${large},0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`,
    };
  });

  return (
    <div className="card-glass p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 className="text-sm font-semibold text-white mb-4">Current Spend Breakdown</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg viewBox="0 0 200 200" className="w-36 h-36 shrink-0">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} stroke="#0a0a14" strokeWidth="2" />
          ))}
          <text x="100" y="96" textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="Inter">Total</text>
          <text x="100" y="110" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter">
            {formatCurrency(total)}
          </text>
        </svg>
        <div className="flex flex-col gap-2 min-w-0">
          {slices.map(s => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-gray-400 truncate">{s.name}</span>
              <span className="text-white font-semibold ml-auto pl-2">{formatCurrency(s.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Bar chart comparison (pure SVG) ───────────────────────────────────────
export function SavingsComparisonBar({ currentMonthlySpend, optimizedMonthlySpend }) {
  const bars = [
    { label: 'Current', value: currentMonthlySpend, color: '#ef4444' },
    { label: 'Optimized', value: optimizedMonthlySpend, color: '#10b981' },
  ];
  const maxVal = Math.max(...bars.map(b => b.value), 1);
  const chartH = 120, chartW = 200, barW = 56, gap = 40, startX = 30;

  return (
    <div className="card-glass p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 className="text-sm font-semibold text-white mb-4">Before vs After Optimization</h3>
      <svg viewBox={`0 0 ${chartW + startX * 2} ${chartH + 40}`} className="w-full" style={{ maxHeight: 160 }}>
        {/* Y-axis grid lines */}
        {[0, 0.5, 1].map(t => {
          const y = 10 + chartH * (1 - t);
          return (
            <g key={t}>
              <line x1={startX} y1={y} x2={chartW + startX} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <text x={startX - 4} y={y + 4} textAnchor="end" fill="#6b7280" fontSize="8" fontFamily="Inter">
                ${Math.round(maxVal * t)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => {
          const barH = (bar.value / maxVal) * chartH;
          const x = startX + i * (barW + gap);
          const y = 10 + chartH - barH;
          return (
            <g key={bar.label}>
              <rect x={x} y={y} width={barW} height={barH} rx="4" fill={bar.color} opacity="0.85" />
              <text x={x + barW / 2} y={10 + chartH + 14} textAnchor="middle" fill="#9ca3af" fontSize="9" fontFamily="Inter">
                {bar.label}
              </text>
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="Inter">
                {formatCurrency(bar.value)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>You save</span>
        <span className="font-semibold" style={{ color: '#10b981' }}>
          {formatCurrency(currentMonthlySpend - optimizedMonthlySpend)}/mo
        </span>
      </div>
    </div>
  );
}
