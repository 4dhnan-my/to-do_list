import { useEffect, useMemo, useState } from 'react';
import { addMinutes, parseDateTime } from '../utils/date.js';

export function useReminders(tasks, settings, updateTask) {
  const [activeReminder, setActiveReminder] = useState(null);
  const [seen, setSeen] = useState(() => new Set());

  const upcoming = useMemo(
    () =>
      tasks
        .filter((task) => !task.completed && task.dueDate && task.dueTime)
        .map((task) => ({
          ...task,
          notifyAt: addMinutes(parseDateTime(task.dueDate, task.dueTime), -(task.reminderMinutes || 0))
        }))
        .sort((a, b) => parseDateTime(a.dueDate, a.dueTime) - parseDateTime(b.dueDate, b.dueTime)),
    [tasks]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const next = upcoming.find((task) => {
        const key = `${task.id}-${task.dueDate}-${task.dueTime}`;
        return !seen.has(key) && task.notifyAt.getTime() <= now;
      });

      if (!next) return;
      const key = `${next.id}-${next.dueDate}-${next.dueTime}`;
      setSeen((previous) => new Set(previous).add(key));
      setActiveReminder(next);

      if (settings.notifications && Notification.permission === 'granted') {
        new Notification(`Reminder: ${next.title}`, {
          body: `${next.category} - ${next.priority} priority`,
          icon: '/icon.svg'
        });
      }

      if (settings.vibration && navigator.vibrate) navigator.vibrate([100, 60, 100]);
      if (settings.reminderSound) {
        const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
        audio.play().catch(() => {});
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [settings.notifications, settings.reminderSound, settings.vibration, seen, upcoming]);

  function snooze(task, minutes) {
    const next = addMinutes(new Date(), minutes);
    updateTask(task.id, {
      dueDate: next.toISOString().slice(0, 10),
      dueTime: next.toTimeString().slice(0, 5),
      reminderMinutes: 0
    });
    setActiveReminder(null);
  }

  return { activeReminder, setActiveReminder, upcoming, snooze };
}
