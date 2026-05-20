import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-white">StackSpend</span>
          </Link>

          {/* Desktop nav */}
          {isHome && (
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/audit" className="btn-primary text-sm py-2 px-5">
              Run Free Audit
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-white/5 bg-surface-900/95 backdrop-blur-lg"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            {isHome && NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 py-1.5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link to="/audit" className="btn-primary justify-center mt-2" onClick={() => setOpen(false)}>
              Run Free Audit
            </Link>
          </div>
        </motion.div>
      )}

      {/* Glass blur bar */}
      <div className="absolute inset-0 -z-10 bg-surface-900/80 backdrop-blur-md border-b border-white/[0.06]" />
    </header>
  );
}
