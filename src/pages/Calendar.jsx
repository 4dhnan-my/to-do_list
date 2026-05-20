import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { PriorityBadge } from '../components/Badge.jsx';
import { addDays, formatDateKey, formatTime, getWeekDays, isToday, parseDateTime, weekLabel } from '../utils/date.js';

const hours = Array.from({ length: 13 }, (_, index) => index + 7);

export function CalendarPage({ tasks, settings, weekAnchor, setWeekAnchor, view, setView, onQuickAdd, moveTask }) {
  const days = getWeekDays(weekAnchor);
  const activeTasks = tasks.filter((task) => !task.completed);

  return (
    <div className="space-y-5">
      <section className="panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Seven-day calendar</p>
            <h2 className="section-title">{weekLabel(weekAnchor)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-button" onClick={() => setWeekAnchor(addDays(weekAnchor, -7))} aria-label="Previous week"><ChevronLeft size={18} /></button>
            <Button variant="subtle" onClick={() => setWeekAnchor(new Date())}>Today</Button>
            <button className="icon-button" onClick={() => setWeekAnchor(addDays(weekAnchor, 7))} aria-label="Next week"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {['week', 'day', 'agenda'].map((item) => (
            <button key={item} className={`segmented ${view === item ? 'active' : ''}`} onClick={() => setView(item)}>{item}</button>
          ))}
        </div>
      </section>

      {view === 'agenda' ? (
        <Agenda tasks={activeTasks} settings={settings} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
          <section className="panel overflow-hidden p-0">
            <div className={`calendar-grid ${view === 'day' ? 'day-mode' : ''}`}>
              <div className="calendar-corner" />
              {days.filter((day) => view === 'week' || isToday(formatDateKey(day))).map((day) => (
                <div key={formatDateKey(day)} className={`calendar-day-head ${isToday(formatDateKey(day)) ? 'today' : ''}`}>
                  <span>{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <strong>{day.getDate()}</strong>
                </div>
              ))}
              {hours.map((hour) => (
                <CalendarHour
                  key={hour}
                  hour={hour}
                  days={days.filter((day) => view === 'week' || isToday(formatDateKey(day)))}
                  tasks={activeTasks}
                  settings={settings}
                  moveTask={moveTask}
                  onQuickAdd={onQuickAdd}
                />
              ))}
              {isCurrentWeek(days) && <div className="current-time-line" style={{ top: `${58 + currentTop()}px` }} />}
            </div>
          </section>
          <MiniMonth weekAnchor={weekAnchor} tasks={activeTasks} />
        </div>
      )}
    </div>
  );
}

function CalendarHour({ hour, days, tasks, settings, moveTask, onQuickAdd }) {
  return (
    <>
      <div className="calendar-hour-label">{formatTime(`${String(hour).padStart(2, '0')}:00`, settings.timeFormat)}</div>
      {days.map((day) => {
        const key = formatDateKey(day);
        const hourTasks = tasks.filter((task) => task.dueDate === key && Number((task.dueTime || '00:00').slice(0, 2)) === hour);
        return (
          <div
            key={`${key}-${hour}`}
            className="calendar-slot"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => moveTask(event.dataTransfer.getData('text/plain'), key, `${String(hour).padStart(2, '0')}:00`)}
            onDoubleClick={() => onQuickAdd(key, `${String(hour).padStart(2, '0')}:00`)}
          >
            <button className="quick-add-slot" onClick={() => onQuickAdd(key, `${String(hour).padStart(2, '0')}:00`)} aria-label="Quick add"><Plus size={13} /></button>
            {hourTasks.slice(0, 3).map((task) => (
              <motion.div key={task.id} draggable onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)} className={`calendar-task ${task.priority.toLowerCase()}`} whileHover={{ scale: 1.02 }}>
                <span>{task.title}</span>
                <small>{formatTime(task.dueTime, settings.timeFormat)}</small>
              </motion.div>
            ))}
            {hourTasks.length > 3 && <span className="more-count">+{hourTasks.length - 3}</span>}
          </div>
        );
      })}
    </>
  );
}

function Agenda({ tasks, settings }) {
  const sorted = [...tasks].sort((a, b) => parseDateTime(a.dueDate, a.dueTime) - parseDateTime(b.dueDate, b.dueTime));
  return (
    <section className="panel">
      <div className="space-y-3">
        {sorted.map((task) => (
          <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/60 p-4 dark:bg-white/5">
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-slate-500">{task.dueDate} at {formatTime(task.dueTime, settings.timeFormat)}</p>
            </div>
            <PriorityBadge priority={task.priority} />
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniMonth({ weekAnchor, tasks }) {
  const first = new Date(weekAnchor.getFullYear(), weekAnchor.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const days = Array.from({ length: 35 }, (_, index) => addDays(start, index));
  return (
    <aside className="panel">
      <p className="eyebrow">Month</p>
      <h3 className="section-title">{weekAnchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => <span key={d} className="text-slate-400">{d}</span>)}
        {days.map((day) => {
          const key = formatDateKey(day);
          const hasTasks = tasks.some((task) => task.dueDate === key);
          return <span key={key} className={`mini-day ${isToday(key) ? 'today' : ''} ${hasTasks ? 'has-tasks' : ''}`}>{day.getDate()}</span>;
        })}
      </div>
      <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-white dark:bg-white dark:text-ink">
        <Clock size={18} />
        <p className="mt-3 text-sm font-semibold">Calendar sync-ready</p>
        <p className="mt-1 text-xs opacity-70">Tasks use clean date/time fields for future backend calendar integrations.</p>
      </div>
    </aside>
  );
}

function isCurrentWeek(days) {
  const today = formatDateKey(new Date());
  return days.some((day) => formatDateKey(day) === today);
}

function currentTop() {
  const now = new Date();
  const startHour = 7;
  const hourHeight = 112;
  return Math.max(0, (now.getHours() - startHour) * hourHeight + (now.getMinutes() / 60) * hourHeight);
}
