import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Building2, User, Mail, Users } from 'lucide-react';
import { useAuditStore } from '../../store/auditStore';
import { leadApi } from '../../services/api';
import { cn } from '../../lib/utils';

export default function LeadCaptureModal({ open, onClose }) {
  const { shareId } = useAuditStore();
  const [form, setForm] = useState({ email: '', company: '', role: '', teamSize: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) { setError('Email is required.'); return; }
    setLoading(true);
    setError('');
    try {
      await leadApi.capture({ ...form, auditShareId: shareId });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md card-glass rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
              id="close-lead-modal"
            >
              <X className="w-4 h-4" />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-lg font-bold text-white mb-2">You're on the list!</h3>
                <p className="text-sm text-gray-400">
                  Our Credex team will reach out shortly to help you implement these savings.
                </p>
                <button onClick={onClose} className="btn-primary mt-6 mx-auto">
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="section-tag mb-3">Free Consultation</div>
                  <h3 className="text-xl font-bold text-white mb-1">Get Expert Help Implementing</h3>
                  <p className="text-sm text-gray-400">
                    Let our Credex team help you lock in these savings. No commitment required.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="lead-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="Work email *"
                      className="input-dark pl-10 text-sm"
                    />
                  </div>

                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      id="lead-company"
                      type="text"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      placeholder="Company name"
                      className="input-dark pl-10 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="lead-role"
                        type="text"
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                        placeholder="Your role"
                        className="input-dark pl-10 text-sm"
                      />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        id="lead-teamsize"
                        type="number"
                        min={1}
                        value={form.teamSize}
                        onChange={e => setForm({ ...form, teamSize: e.target.value })}
                        placeholder="Team size"
                        className="input-dark pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    id="lead-submit"
                    className="btn-primary w-full justify-center mt-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Free Consultation'}
                  </button>

                  <p className="text-[11px] text-gray-600 text-center">
                    No spam. Unsubscribe at any time.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
