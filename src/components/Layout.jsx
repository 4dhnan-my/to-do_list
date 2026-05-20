import { motion } from 'framer-motion';
import { BarChart3, BellRing, CalendarDays, CheckCircle2, LayoutDashboard, ListTodo, Moon, Plus, Settings, Sun } from 'lucide-react';
import { Button } from './Button.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reminders', label: 'Reminders', icon: BellRing },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export function Layout({ page, setPage, settings, setSettings, children, onAdd }) {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="min-h-screen bg-mist text-slate-900 transition-colors dark:bg-[#0d111a] dark:text-white">
      <aside className="fixed inset-y-4 left-4 z-30 hidden w-64 rounded-[2rem] border border-white/40 bg-white/60 p-4 shadow-soft backdrop-blur-2xl dark:border-white/10 dark:bg-white/10 lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white shadow-glow dark:bg-white dark:text-ink">T</div>
          <div>
            <p className="font-semibold">Tempo AI</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Weekly planner</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)} className={`nav-item ${active ? 'active' : ''}`}>
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-ink">
          <p className="text-sm font-semibold">Daily planning ready</p>
          <p className="mt-1 text-xs opacity-70">Use `N` for quick add and `/` to search.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-white/40 bg-mist/75 backdrop-blur-xl dark:border-white/10 dark:bg-[#0d111a]/75 lg:ml-72">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <motion.h1 key={page} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-semibold capitalize sm:text-2xl">
              {page === 'calendar' ? 'Weekly Calendar' : page}
            </motion.h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">A calmer command center for your week.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="icon-button"
              onClick={() => setSettings((current) => ({ ...current, theme: isDark ? 'light' : 'dark' }))}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button onClick={onAdd} className="hidden sm:inline-flex">
              <Plus size={17} /> New task
            </Button>
          </div>
        </div>
      </header>

      <main className="pb-24 lg:ml-72">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">{children}</div>
      </main>

      <button className="fab sm:hidden" onClick={onAdd} aria-label="Add task">
        <Plus size={24} />
      </button>
      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-[1.6rem] border border-white/40 bg-white/75 p-2 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75 lg:hidden">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`mobile-nav ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)} aria-label={item.label}>
              <Icon size={19} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
