import { motion } from 'framer-motion';
import { PriorityBadge } from '../components/Badge.jsx';

export function AnalyticsPage({ tasks, analytics }) {
  const max = Math.max(...analytics.weeklyCounts.map((item) => item.completed), 1);
  const priorities = ['High', 'Medium', 'Low'].map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length
  }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Stat title="Completed this week" value={analytics.completedThisWeek} />
        <Stat title="Completion rate" value={`${analytics.completionRate}%`} />
        <Stat title="Focus hours" value={`${analytics.focusHours}h`} />
        <Stat title="Most productive day" value={analytics.bestDay} />
      </div>
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Productivity</p>
            <h2 className="section-title">Weekly completion graph</h2>
          </div>
        </div>
        <div className="mt-6 flex h-64 items-end gap-3">
          {analytics.weeklyCounts.map((item) => (
            <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
              <motion.div className="w-full rounded-t-3xl bg-gradient-to-t from-royal to-jade shadow-glow" initial={{ height: 0 }} animate={{ height: `${Math.max(8, (item.completed / max) * 100)}%` }} transition={{ type: 'spring', stiffness: 120, damping: 18 }} />
              <span className="text-xs text-slate-500">{item.day}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel">
          <p className="eyebrow">Distribution</p>
          <h2 className="section-title">Priority mix</h2>
          <div className="mt-5 space-y-4">
            {priorities.map((item) => (
              <div key={item.priority}>
                <div className="mb-2 flex items-center justify-between">
                  <PriorityBadge priority={item.priority} />
                  <span className="text-sm text-slate-500">{item.count} tasks</span>
                </div>
                <div className="h-3 rounded-full bg-slate-950/10 dark:bg-white/10">
                  <motion.div className="h-3 rounded-full bg-gradient-to-r from-ember via-royal to-jade" initial={{ width: 0 }} animate={{ width: `${tasks.length ? (item.count / tasks.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <p className="eyebrow">Focus</p>
          <h2 className="section-title">Working rhythm</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Insight label="Deep work blocks" value={analytics.deepWorkBlocks} />
            <Insight label="Overdue warnings" value={analytics.overdue} />
            <Insight label="Streak counter" value={`${analytics.streak} days`} />
            <Insight label="Open capacity" value={analytics.open < 8 ? 'Healthy' : 'Heavy'} />
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return <div className="panel p-4"><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-slate-500">{title}</p></div>;
}

function Insight({ label, value }) {
  return <div className="rounded-3xl bg-white/60 p-4 dark:bg-white/5"><p className="text-xl font-semibold">{value}</p><p className="text-sm text-slate-500">{label}</p></div>;
}
