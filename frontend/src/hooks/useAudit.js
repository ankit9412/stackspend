import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditStore } from '../store/auditStore';
import { auditApi } from '../services/api';

export function useAudit() {
  const navigate = useNavigate();
  const { form, setResult, setLoading, setError } = useAuditStore();

  const submitAudit = useCallback(async () => {
    setLoading(true);

    // Validate at least one tool with a plan
    const validTools = form.tools.filter(t => t.toolId && t.planKey);
    if (validTools.length === 0) {
      setError('Please add at least one tool with a plan selected.');
      return;
    }

    try {
      const response = await auditApi.runAudit({
        tools: validTools,
        teamSize: form.teamSize,
        primaryUseCase: form.primaryUseCase,
      });

      if (response.success) {
        setResult(response.data, response.data.shareId);
        navigate(`/results/${response.data.shareId}`);
      } else {
        setError(response.error || 'Audit failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to run audit. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [form, navigate, setResult, setLoading, setError]);

  return { submitAudit };
}
