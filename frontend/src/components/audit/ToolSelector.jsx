import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { TOOLS_LIST } from '../../utils/toolData';
import { useAuditStore } from '../../store/auditStore';
import { cn } from '../../lib/utils';

export default function ToolSelector() {
  const { form, addTool, removeTool } = useAuditStore();
  const selectedIds = new Set(form.tools.map(t => t.toolId));

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-1">Select Your AI Tools</h2>
      <p className="text-sm text-gray-400 mb-4">Click to add tools you currently pay for.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TOOLS_LIST.map((tool, i) => {
          const selected = selectedIds.has(tool.id);
          return (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => selected ? removeTool(tool.id) : addTool(tool.id)}
              className={cn(
                'relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                selected
                  ? 'border-brand-500/60 bg-brand-500/10 shadow-glow-sm'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
              )}
              aria-pressed={selected}
              id={`tool-select-${tool.id}`}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </span>
              )}
              <span className="text-2xl">{tool.emoji}</span>
              <div className="text-center">
                <p className="text-xs font-semibold text-white leading-tight">{tool.name}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{tool.vendor}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
