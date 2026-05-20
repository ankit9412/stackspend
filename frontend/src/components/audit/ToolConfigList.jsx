import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TOOLS } from '../../utils/toolData';
import { useAuditStore } from '../../store/auditStore';
import { cn } from '../../lib/utils';

function ToolRow({ entry }) {
  const { updateTool, removeTool } = useAuditStore();
  const tool = TOOLS[entry.toolId];
  if (!tool) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="card-glass p-4 overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xl">{tool.emoji}</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{tool.name}</p>
          <p className="text-xs text-gray-500">{tool.vendor}</p>
        </div>
        <button
          onClick={() => removeTool(entry.toolId)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors"
          aria-label={`Remove ${tool.name}`}
          id={`remove-tool-${entry.toolId}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Plan select */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">Plan</label>
          <select
            id={`plan-${entry.toolId}`}
            value={entry.planKey}
            onChange={e => updateTool(entry.toolId, { planKey: e.target.value })}
            className="input-dark text-sm py-2"
          >
            <option value="">Select plan...</option>
            {tool.plans.map(plan => (
              <option key={plan.key} value={plan.key}>
                {plan.label} {plan.pricePerSeat !== null ? `($${plan.pricePerSeat}/seat)` : '(usage-based)'}
              </option>
            ))}
          </select>
        </div>

        {/* Seats (if applicable) */}
        {tool.supportsSeats && (
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Seats / Users</label>
            <input
              id={`seats-${entry.toolId}`}
              type="number"
              min={1}
              max={10000}
              value={entry.seats || 1}
              onChange={e => updateTool(entry.toolId, { seats: parseInt(e.target.value) || 1 })}
              className="input-dark text-sm py-2"
            />
          </div>
        )}

        {/* Monthly spend */}
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block font-medium">
            {tool.usageBased ? 'Monthly Spend ($)' : 'Monthly Spend (override)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              id={`spend-${entry.toolId}`}
              type="number"
              min={0}
              step={1}
              value={entry.monthlySpend || ''}
              onChange={e => updateTool(entry.toolId, { monthlySpend: parseFloat(e.target.value) || 0 })}
              placeholder={tool.usageBased ? 'Required' : 'Auto-calc'}
              className="input-dark text-sm py-2 pl-7"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ToolConfigList() {
  const { form } = useAuditStore();

  if (form.tools.length === 0) {
    return (
      <div className="card-glass p-8 text-center text-gray-500">
        <p className="text-3xl mb-2">☝️</p>
        <p className="text-sm">Select at least one tool above to configure it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {form.tools.map(entry => (
          <ToolRow key={entry.toolId} entry={entry} />
        ))}
      </AnimatePresence>
    </div>
  );
}
