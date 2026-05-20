import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Zap, ArrowRight } from 'lucide-react';
import ToolSelector from '../components/audit/ToolSelector';
import ToolConfigList from '../components/audit/ToolConfigList';
import ContextForm from '../components/audit/ContextForm';
import { useAuditStore } from '../store/auditStore';
import { useAudit } from '../hooks/useAudit';

export default function AuditFormPage() {
  const { form, isLoading, error, clearError } = useAuditStore();
  const { submitAudit } = useAudit();

  const hasValidTools = form.tools.some(t => t.toolId && t.planKey);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-semibold tracking-wider uppercase mb-4">
            <Zap className="w-3 h-3" />
            Free Audit
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Audit Your AI Stack
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Add every AI tool your team pays for. We'll tell you exactly where to cut costs.
          </p>
        </motion.div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-300 text-xs">Dismiss</button>
          </motion.div>
        )}

        {/* Step 1: Select tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-glass rounded-2xl p-6 mb-5"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">1</span>
            <h2 className="text-base font-semibold text-white">Select Your AI Tools</h2>
          </div>
          <ToolSelector />
        </motion.div>

        {/* Step 2: Configure each tool */}
        {form.tools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5"
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">2</span>
              <h2 className="text-base font-semibold text-white">Configure Each Tool</h2>
            </div>
            <ToolConfigList />
          </motion.div>
        )}

        {/* Step 3: Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-glass rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs font-bold text-white">3</span>
            <h2 className="text-base font-semibold text-white">About Your Team</h2>
          </div>
          <ContextForm />
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <button
            id="run-audit-btn"
            onClick={submitAudit}
            disabled={isLoading || !hasValidTools}
            className="btn-primary text-base px-10 py-4 shadow-glow disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing your stack…
              </>
            ) : (
              <>
                Run My Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
          {!hasValidTools && (
            <p className="text-xs text-gray-600 mt-2">Add at least one tool and select a plan to continue.</p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
