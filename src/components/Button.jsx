export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-ink text-white shadow-soft hover:-translate-y-0.5 dark:bg-white dark:text-ink',
    subtle: 'bg-white/70 text-slate-700 hover:bg-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    ghost: 'text-slate-600 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:bg-white/10'
  };

  return (
    <button className={`button ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
