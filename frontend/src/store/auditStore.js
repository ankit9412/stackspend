import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'stackspend-form';

const defaultForm = {
  tools: [],
  teamSize: 1,
  primaryUseCase: 'mixed',
};

export const useAuditStore = create(
  persist(
    (set, get) => ({
      // Form state (persisted in localStorage)
      form: { ...defaultForm },

      // Result state (not persisted)
      result: null,
      shareId: null,
      isLoading: false,
      error: null,

      // ── Form Actions ────────────────────────────────────────
      addTool: (toolId) => {
        const { form } = get();
        if (form.tools.find(t => t.toolId === toolId)) return;
        set({
          form: {
            ...form,
            tools: [...form.tools, { toolId, planKey: '', seats: 1, monthlySpend: 0 }],
          },
        });
      },

      removeTool: (toolId) => {
        set(state => ({
          form: {
            ...state.form,
            tools: state.form.tools.filter(t => t.toolId !== toolId),
          },
        }));
      },

      updateTool: (toolId, updates) => {
        set(state => ({
          form: {
            ...state.form,
            tools: state.form.tools.map(t =>
              t.toolId === toolId ? { ...t, ...updates } : t
            ),
          },
        }));
      },

      setTeamSize: (size) =>
        set(state => ({ form: { ...state.form, teamSize: parseInt(size) || 1 } })),

      setUseCase: (useCase) =>
        set(state => ({ form: { ...state.form, primaryUseCase: useCase } })),

      resetForm: () => set({ form: { ...defaultForm }, result: null, shareId: null, error: null }),

      // ── Result Actions ──────────────────────────────────────
      setResult: (result, shareId) => set({ result, shareId, error: null }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ form: state.form }), // only persist form
    }
  )
);
