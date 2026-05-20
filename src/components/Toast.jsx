import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function ToastStack({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div key={toast.id} className="glass flex items-center gap-3 p-3 shadow-soft" initial={{ opacity: 0, y: -14, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 20 }}>
            <CheckCircle2 className="text-jade" size={20} />
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
