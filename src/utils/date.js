export const DAY_MS = 24 * 60 * 60 * 1000;

export function startOfDay(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function formatDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateTime(dateKey, time = '09:00') {
  return new Date(`${dateKey}T${time || '09:00'}:00`);
}

export function isToday(dateKey) {
  return dateKey === formatDateKey(new Date());
}

export function isOverdue(task) {
  if (task.completed || !task.dueDate) return false;
  return parseDateTime(task.dueDate, task.dueTime).getTime() < Date.now();
}

export function getWeekStart(date = new Date()) {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

export function getWeekDays(anchor = new Date()) {
  const start = getWeekStart(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function formatFriendlyDate(dateKey) {
  if (!dateKey) return 'No date';
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

export function formatTime(time, format = '12') {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  if (format === '24') return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function weekLabel(anchor) {
  const days = getWeekDays(anchor);
  const start = days[0];
  const end = days[6];
  const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}
