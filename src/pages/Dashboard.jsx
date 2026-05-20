import { motion } from 'framer-motion';
import { CalendarClock, Flame, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { PriorityBadge } from '../components/Badge.jsx';
import { createDailyPlan, generateSuggestions } from '../utils/ai.js';
import { formatDateKey, isOverdue } from '../utils/date.js';

export function Dashboard({ tasks, analytics, onAdd, setPage }) {
  const tips = generateSuggestions(tasks);
  const plan = createDailyPlan(tasks);
  const todayTasks = tasks.filter((task) => task.dueDate === formatDateKey(new Date()) && !task.completed);
  const overdue = tasks.filter(isOverdue);

  return (
    <div className="space-y-5">
      <section className="hero-panel">
        <div className="max-w-3xl">
          <p className="eyebrow">AI weekly command center</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white sm:text-5xl">Plan the day, protect the focus, finish with less friction.</h2>
          <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Tempo turns tasks, reminders, and a seven-day calendar into one polished planning surface.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onAdd}>Create a task</Button>
            <Button variant="subtle" onClick={() => setPage('calendar')}>Open calendar</Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric icon={Target} label="Open tasks" value={analytics.open} />
        <Metric icon={TrendingUp} label="Completion rate" value={`${analytics.completionRate}%`} />
        <Metric icon={Flame} label="Daily streak" value={`${analytics.streak}d`} />
        <Metric icon={CalendarClock} label="Overdue" value={overdue.length} tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Today</p>
              <h3 className="section-title">AI daily planner</h3>
            </div>
            <span className="text-sm text-slate-500">{todayTasks.length} scheduled</span>
          </div>
          <div className="mt-4 space-y-3">
            {(plan.length ? plan : todayTasks.slice(0, 4)).map((item, index) => (
              <motion.div key={item.id || item.title} className="timeline-row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <span className="w-20 text-sm font-semibold text-slate-500">{item.time || todayTasks[index]?.dueTime}</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  {item.priority && <PriorityBadge priority={item.priority} />}
                </div>
              </motion.div>
            ))}
            {!plan.length && !todayTasks.length && <EmptyMini text="No tasks today. Add a focus block or enjoy the white space." />}
          </div>
        </section>

        <section className="panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Copilot</p>
              <h3 className="section-title">Productivity tips</h3>
            </div>
            <Sparkles className="text-ember" />
          </div>
          <div className="mt-4 space-y-3">
            {tips.map((tip) => (
              <div key={tip} className="rounded-3xl bg-white/60 p-4 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">{tip}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = 'royal' }) {
  const toneClass = tone === 'rose' ? 'bg-rose-500/15 text-rose-500' : 'bg-royal/15 text-royal';
  return (
    <motion.div className="panel p-4" whileHover={{ y: -4 }}>
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-2xl ${toneClass}`}>
        <Icon size={20} />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}

function EmptyMini({ text }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-white/15">{text}</div>;
}
