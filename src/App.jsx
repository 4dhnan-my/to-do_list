import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BellRing } from 'lucide-react';
import { Layout } from './components/Layout.jsx';
import { Modal } from './components/Modal.jsx';
import { TaskForm } from './components/TaskForm.jsx';
import { ToastStack } from './components/Toast.jsx';
import { Button } from './components/Button.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { TasksPage } from './pages/Tasks.jsx';
import { CalendarPage } from './pages/Calendar.jsx';
import { AnalyticsPage } from './pages/Analytics.jsx';
import { RemindersPage } from './pages/Reminders.jsx';
import { SettingsPage } from './pages/Settings.jsx';
import { sampleTasks, defaultSettings } from './data/sampleData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useReminders } from './hooks/useReminders.js';
import { addDays, formatDateKey, getWeekDays, isOverdue } from './utils/date.js';
import { parseNaturalTask } from './utils/ai.js';

export default function App() {
  const [tasks, setTasks] = useLocalStorage('tempo.tasks', sampleTasks);
  const [settings, setSettings] = useLocalStorage('tempo.settings', defaultSettings);
  const [page, setPage] = useState('dashboard');
  const [filters, setFilters] = useState({ search: '', priority: 'All', category: 'All' });
  const [weekAnchor, setWeekAnchor] = useState(new Date());
  const [calendarView, setCalendarView] = useState('week');
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [onboarding, setOnboarding] = useState(!settings.onboardingSeen);
  const [loading, setLoading] = useState(true);

  const analytics = useMemo(() => getAnalytics(tasks), [tasks]);
  const { activeReminder, setActiveReminder, upcoming, snooze } = useReminders(tasks, settings, updateTask);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 420);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
  }, [settings.theme]);

  useEffect(() => {
    function handleKeys(event) {
      if (event.target.matches('input, textarea, select')) return;
      if (event.key.toLowerCase() === 'n') setTaskModal({ open: true, task: null });
      if (event.key === '/') {
        event.preventDefault();
        document.getElementById('global-search')?.focus();
        setPage('tasks');
      }
      if (event.key.toLowerCase() === 'c') setPage('calendar');
    }
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, []);

  function toast(message) {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 2800);
  }

  function addTask(task) {
    const newTask = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
      order: Math.max(0, ...tasks.map((item) => item.order || 0)) + 1
    };
    setTasks((current) => [newTask, ...current]);
    setTaskModal({ open: false, task: null });
    toast('Task created');
  }

  function updateTask(id, patch) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }

  function saveTask(task) {
    if (task.id) {
      updateTask(task.id, task);
      toast('Task updated');
    } else {
      addTask(task);
      return;
    }
    setTaskModal({ open: false, task: null });
  }

  function toggleTask(id) {
    setTasks((current) => {
      const target = current.find((task) => task.id === id);
      const updated = current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : null } : task
      );

      if (!target || target.completed || target.repeat === 'none') return updated;

      const nextDate = new Date(`${target.dueDate}T${target.dueTime || '09:00'}:00`);
      if (target.repeat === 'daily') nextDate.setDate(nextDate.getDate() + 1);
      if (target.repeat === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      if (target.repeat === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);

      return [
        {
          ...target,
          id: crypto.randomUUID(),
          dueDate: formatDateKey(nextDate),
          completed: false,
          completedAt: null,
          createdAt: Date.now(),
          order: Math.max(0, ...current.map((task) => task.order || 0)) + 1
        },
        ...updated
      ];
    });
  }

  function deleteTask() {
    setTasks((current) => current.filter((task) => task.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast('Task deleted');
  }

  function reorderTask(sourceId, targetId) {
    if (!sourceId || sourceId === targetId) return;
    const ordered = [...tasks].sort((a, b) => a.order - b.order);
    const from = ordered.findIndex((task) => task.id === sourceId);
    const to = ordered.findIndex((task) => task.id === targetId);
    if (from < 0 || to < 0) return;
    const [moved] = ordered.splice(from, 1);
    ordered.splice(to, 0, moved);
    setTasks(ordered.map((task, index) => ({ ...task, order: index + 1 })));
    toast('Order updated');
  }

  function moveTask(id, dueDate, dueTime) {
    updateTask(id, { dueDate, dueTime });
    toast('Task rescheduled');
  }

  function quickAddFromCalendar(dueDate, dueTime) {
    setTaskModal({
      open: true,
      task: {
        ...parseNaturalTask(`New focus block today at ${dueTime}`, settings),
        title: '',
        notes: '',
        category: 'Calendar',
        tags: [],
        dueDate,
        dueTime,
        priority: 'Medium',
        repeat: 'none',
        subtasks: []
      }
    });
  }

  function requestNotifications() {
    if (!('Notification' in window)) {
      toast('Browser notifications are not supported here');
      return;
    }
    Notification.requestPermission().then((permission) => {
      toast(permission === 'granted' ? 'Notifications enabled' : 'Notifications not enabled');
    });
  }

  function resetAll() {
    if (!confirm('Reset all Tempo data? This cannot be undone.')) return;
    setTasks(sampleTasks);
    setSettings({ ...defaultSettings, onboardingSeen: true });
    toast('Data reset');
  }

  const pageProps = { tasks, settings, analytics, setPage };

  if (loading) {
    return (
      <div className="min-h-screen bg-mist p-5 dark:bg-[#0d111a]">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[260px_1fr]">
          <div className="hidden rounded-[2rem] bg-white/60 p-4 shadow-soft dark:bg-white/10 lg:block">
            <div className="skeleton h-12 w-36" />
            <div className="mt-8 space-y-3">{Array.from({ length: 7 }, (_, index) => <div key={index} className="skeleton h-11" />)}</div>
          </div>
          <div className="space-y-5">
            <div className="skeleton h-24" />
            <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="skeleton h-32" />)}</div>
            <div className="skeleton h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastStack toasts={toasts} />
      <Layout page={page} setPage={setPage} settings={settings} setSettings={setSettings} onAdd={() => setTaskModal({ open: true, task: null })}>
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
            {page === 'dashboard' && <Dashboard {...pageProps} onAdd={() => setTaskModal({ open: true, task: null })} />}
            {page === 'calendar' && <CalendarPage tasks={tasks} settings={settings} weekAnchor={weekAnchor} setWeekAnchor={setWeekAnchor} view={calendarView} setView={setCalendarView} moveTask={moveTask} onQuickAdd={quickAddFromCalendar} />}
            {page === 'tasks' && <TasksPage tasks={tasks} settings={settings} filters={filters} setFilters={setFilters} onToggle={toggleTask} onEdit={(task) => setTaskModal({ open: true, task })} onDelete={setDeleteTarget} onReorder={reorderTask} />}
            {page === 'completed' && <TasksPage tasks={tasks} settings={settings} filters={filters} setFilters={setFilters} completedOnly onToggle={toggleTask} onEdit={(task) => setTaskModal({ open: true, task })} onDelete={setDeleteTarget} onReorder={reorderTask} />}
            {page === 'analytics' && <AnalyticsPage tasks={tasks} analytics={analytics} />}
            {page === 'reminders' && <RemindersPage upcoming={upcoming} settings={settings} tasks={tasks} requestNotifications={requestNotifications} quickSnooze={(task, minutes) => snooze(task, minutes)} />}
            {page === 'settings' && <SettingsPage settings={settings} setSettings={setSettings} tasks={tasks} importTasks={setTasks} resetAll={resetAll} toast={toast} />}
          </motion.div>
        </AnimatePresence>
      </Layout>

      <Modal open={taskModal.open} title={taskModal.task?.id ? 'Edit task' : 'Create task'} onClose={() => setTaskModal({ open: false, task: null })}>
        <TaskForm initialTask={taskModal.task} settings={settings} onSubmit={saveTask} onCancel={() => setTaskModal({ open: false, task: null })} />
      </Modal>

      <Modal open={!!deleteTarget} title="Delete this task?" onClose={() => setDeleteTarget(null)}>
        <p className="text-slate-600 dark:text-slate-300">This removes <strong>{deleteTarget?.title}</strong> from your planner.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={deleteTask}>Delete</Button>
        </div>
      </Modal>

      <Modal open={!!activeReminder} title="Reminder" onClose={() => setActiveReminder(null)}>
        <div className="flex gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ember/15 text-ember"><BellRing /></div>
          <div>
            <h3 className="font-semibold">{activeReminder?.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{activeReminder?.category} · {activeReminder?.priority} priority</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="subtle" onClick={() => snooze(activeReminder, 10)}>Remind in 10 mins</Button>
          <Button variant="subtle" onClick={() => snooze(activeReminder, 60)}>1 hour</Button>
          <Button onClick={() => setActiveReminder(null)}>Done</Button>
        </div>
      </Modal>

      <Modal open={onboarding} title="Welcome to Tempo AI" onClose={() => setOnboarding(false)}>
        <div className="space-y-4">
          <div className="h-36 rounded-[2rem] bg-gradient-to-br from-royal via-jade to-ember shadow-glow" />
          <p className="text-slate-600 dark:text-slate-300">A polished weekly planner with AI-style task parsing, smart reminders, analytics, and a responsive calendar. Press `N` to add, `/` to search, and `C` for calendar.</p>
          <Button onClick={() => { setSettings((current) => ({ ...current, onboardingSeen: true })); setOnboarding(false); }}>Start planning</Button>
        </div>
      </Modal>
    </>
  );
}

function getAnalytics(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const weekDays = getWeekDays(new Date());
  const weeklyCounts = weekDays.map((day) => {
    const key = formatDateKey(day);
    return {
      day: day.toLocaleDateString(undefined, { weekday: 'short' }),
      completed: tasks.filter((task) => task.completedAt && formatDateKey(new Date(task.completedAt)) === key).length
    };
  });
  const best = weeklyCounts.reduce((a, b) => (b.completed > a.completed ? b : a), weeklyCounts[0]);
  const completedThisWeek = weeklyCounts.reduce((sum, item) => sum + item.completed, 0);
  const dueFocusHours = tasks.filter((task) => task.category.toLowerCase().includes('focus')).length * 1.5;

  return {
    total,
    completed,
    open: tasks.filter((task) => !task.completed).length,
    completionRate: total ? Math.round((completed / total) * 100) : 0,
    completedThisWeek,
    weeklyCounts,
    streak: calculateStreak(tasks),
    focusHours: Math.round(dueFocusHours + completedThisWeek * 0.75),
    bestDay: best?.completed ? best.day : 'Today',
    deepWorkBlocks: tasks.filter((task) => task.tags?.includes('deep-work') || task.category === 'Focus').length,
    overdue: tasks.filter(isOverdue).length
  };
}

function calculateStreak(tasks) {
  let streak = 0;
  for (let i = 0; i < 14; i += 1) {
    const key = formatDateKey(addDays(new Date(), -i));
    const hasCompleted = tasks.some((task) => task.completedAt && formatDateKey(new Date(task.completedAt)) === key);
    if (hasCompleted) streak += 1;
    else if (i > 0) break;
  }
  return streak;
}
