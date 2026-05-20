import { BellRing, Clock, Zap } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { formatFriendlyDate, formatTime, isOverdue } from '../utils/date.js';

export function RemindersPage({ upcoming, settings, requestNotifications, quickSnooze, tasks }) {
  const overdue = tasks.filter(isOverdue);
  return (
    <div className="space-y-5">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Smart reminders</p>
            <h2 className="section-title">Upcoming alerts</h2>
          </div>
          <Button variant="subtle" onClick={requestNotifications}><BellRing size={16} /> Enable notifications</Button>
        </div>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Browser notifications are permission-based. Popups, snooze, repeat settings, sound, and vibration run locally.</p>
      </section>
      {!!overdue.length && (
        <section className="rounded-[2rem] border border-rose-400/30 bg-rose-500/10 p-5">
          <h3 className="font-semibold text-rose-600 dark:text-rose-300">Overdue warnings</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {overdue.map((task) => <ReminderRow key={task.id} task={task} settings={settings} quickSnooze={quickSnooze} />)}
          </div>
        </section>
      )}
      <section className="grid gap-3 md:grid-cols-2">
        {upcoming.map((task) => <ReminderRow key={task.id} task={task} settings={settings} quickSnooze={quickSnooze} />)}
      </section>
      {!upcoming.length && <div className="empty-state"><Zap className="mx-auto mb-3 text-jade" size={36} /><h3 className="font-semibold">No upcoming reminders</h3><p className="text-slate-500">Add due times to tasks to activate the reminder engine.</p></div>}
    </div>
  );
}

function ReminderRow({ task, settings, quickSnooze }) {
  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{task.title}</p>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500"><Clock size={15} /> {formatFriendlyDate(task.dueDate)} at {formatTime(task.dueTime, settings.timeFormat)}</p>
          <p className="mt-2 text-xs text-slate-500">Reminds {task.reminderMinutes} minutes before · {task.repeat}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="subtle" onClick={() => quickSnooze(task, 10)}>10 mins</Button>
        <Button variant="subtle" onClick={() => quickSnooze(task, 60)}>1 hour</Button>
        <Button variant="subtle" onClick={() => quickSnooze(task, 1440)}>Tomorrow</Button>
      </div>
    </div>
  );
}
