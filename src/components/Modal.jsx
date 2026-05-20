import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="glass w-full max-w-xl p-5 shadow-glow" initial={{ y: 22, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 16, scale: 0.97, opacity: 0 }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
              <button className="icon-button" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
