const styles = {
  High: 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-400/30',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/30',
  Low: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-400/30'
};

export function PriorityBadge({ priority }) {
  return <span className={`badge ${styles[priority] || styles.Medium}`}>{priority}</span>;
}

export function Tag({ children }) {
  return <span className="rounded-full border border-white/20 bg-white/40 px-2.5 py-1 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-300">{children}</span>;
}
