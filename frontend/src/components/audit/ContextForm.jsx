import { Users } from 'lucide-react';
import { USE_CASES } from '../../utils/toolData';
import { useAuditStore } from '../../store/auditStore';
import { cn } from '../../lib/utils';

export default function ContextForm() {
  const { form, setTeamSize, setUseCase } = useAuditStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Team size */}
      <div>
        <label htmlFor="team-size" className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-400" />
          Team Size
        </label>
        <input
          id="team-size"
          type="number"
          min={1}
          max={100000}
          value={form.teamSize}
          onChange={e => setTeamSize(e.target.value)}
          className="input-dark"
          placeholder="e.g. 12"
        />
        <p className="text-xs text-gray-500 mt-1.5">Total number of people using AI tools</p>
      </div>

      {/* Primary use case */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-2 block">
          Primary Use Case
        </label>
        <div className="grid grid-cols-1 gap-2">
          {USE_CASES.map(uc => (
            <button
              key={uc.value}
              id={`use-case-${uc.value}`}
              onClick={() => setUseCase(uc.value)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150',
                form.primaryUseCase === uc.value
                  ? 'border-brand-500/50 bg-brand-500/10 text-white'
                  : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-gray-200'
              )}
            >
              <span className="text-base">{uc.icon}</span>
              <span className="text-sm font-medium">{uc.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
