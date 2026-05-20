import { addDays, addMinutes, formatDateKey } from './date.js';

const priorityWords = {
  High: ['urgent', 'asap', 'critical', 'deadline', 'finish', 'submit', 'launch', 'ship', 'review'],
  Medium: ['plan', 'prepare', 'meeting', 'call', 'design', 'draft', 'follow up'],
  Low: ['someday', 'maybe', 'read', 'organize', 'browse', 'idea']
};

export function recommendPriority(text = '') {
  const lower = text.toLowerCase();
  for (const [priority, words] of Object.entries(priorityWords)) {
    if (words.some((word) => lower.includes(word))) return priority;
  }
  return 'Medium';
}

export function parseNaturalTask(input, settings = {}) {
  const now = new Date();
  let due = new Date(now);
  let matchedDate = false;
  const lower = input.toLowerCase();

  if (lower.includes('tomorrow')) {
    due = addDays(now, 1);
    matchedDate = true;
  } else if (lower.includes('today')) {
    matchedDate = true;
  } else {
    const inDays = lower.match(/\bin\s+(\d+)\s+days?\b/);
    if (inDays) {
      due = addDays(now, Number(inDays[1]));
      matchedDate = true;
    }
    const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].find((day) =>
      lower.includes(day)
    );
    if (weekday) {
      const target = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(weekday);
      const delta = (target - now.getDay() + 7) % 7 || 7;
      due = addDays(now, delta);
      matchedDate = true;
    }
  }

  const timeMatch = lower.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/) || lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\b/);
  let dueTime = settings.defaultTime || '09:00';
  if (timeMatch) {
    let hour = Number(timeMatch[1]);
    const minute = Number(timeMatch[2] || 0);
    const suffix = timeMatch[3];
    if (suffix === 'pm' && hour < 12) hour += 12;
    if (suffix === 'am' && hour === 12) hour = 0;
    dueTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  const cleaned = input
    .replace(/\btoday|tomorrow|sunday|monday|tuesday|wednesday|thursday|friday|saturday\b/gi, '')
    .replace(/\bin\s+\d+\s+days?\b/gi, '')
    .replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(am|pm)?\b/gi, '')
    .replace(/\b\d{1,2}(?::\d{2})?\s*(am|pm)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: cleaned || input,
    dueDate: matchedDate || timeMatch ? formatDateKey(due) : formatDateKey(now),
    dueTime,
    priority: recommendPriority(input),
    reminderMinutes: settings.defaultReminderMinutes || 30
  };
}

export function breakdownTask(title) {
  const base = title.replace(/[.!?]+$/, '');
  return [
    `Clarify the outcome for ${base}`,
    `Gather assets and context`,
    `Create the first complete draft`,
    `Review, refine, and remove blockers`,
    `Ship it and schedule a follow-up`
  ].map((item) => ({ id: crypto.randomUUID(), title: item, completed: false }));
}

export function generateSuggestions(tasks) {
  const open = tasks.filter((task) => !task.completed);
  const categories = [...new Set(open.map((task) => task.category))].slice(0, 3);
  return [
    'Block one 50-minute focus sprint before checking messages.',
    open.length > 6 ? 'Move two low-priority items out of today to protect your main goal.' : 'Your workload is focused. Add one recovery buffer after deep work.',
    categories.length ? `Batch similar work together: ${categories.join(', ')}.` : 'Create one category for your biggest current project.'
  ];
}

export function createDailyPlan(tasks) {
  const todayKey = formatDateKey(new Date());
  const today = tasks
    .filter((task) => !task.completed && task.dueDate === todayKey)
    .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''));

  const now = new Date();
  return today.slice(0, 5).map((task, index) => ({
    id: `${task.id}-plan`,
    time: addMinutes(now, 45 * (index + 1)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: task.title,
    priority: task.priority
  }));
}

export function smartScheduleHint(task) {
  if (task.priority === 'High') return 'Schedule this before lunch while attention is highest.';
  if (task.priority === 'Medium') return 'Pair this with a related admin block to reduce context switching.';
  return 'Keep this as a flexible filler task for low-energy moments.';
}
