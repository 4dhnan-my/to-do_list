import { useEffect, useState } from 'react';
import { Brain, Mic, WandSparkles } from 'lucide-react';
import { Button } from './Button.jsx';
import { breakdownTask, parseNaturalTask, recommendPriority } from '../utils/ai.js';
import { formatDateKey } from '../utils/date.js';

const blankTask = {
  title: '',
  notes: '',
  category: 'Work',
  tags: '',
  priority: 'Medium',
  dueDate: formatDateKey(new Date()),
  dueTime: '09:00',
  repeat: 'none',
  reminderMinutes: 30,
  subtasks: []
};

export function TaskForm({ initialTask, settings, onSubmit, onCancel }) {
  const [task, setTask] = useState(blankTask);
  const [natural, setNatural] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTask({ ...initialTask, tags: initialTask.tags?.join(', ') || '' });
    } else {
      setTask({ ...blankTask, reminderMinutes: settings.defaultReminderMinutes });
    }
  }, [initialTask, settings.defaultReminderMinutes]);

  function update(field, value) {
    setTask((current) => ({ ...current, [field]: value }));
  }

  function applyNatural() {
    if (!natural.trim()) return;
    const parsed = parseNaturalTask(natural, settings);
    setTask((current) => ({ ...current, ...parsed }));
  }

  function submit(event) {
    event.preventDefault();
    if (!task.title.trim()) return;
    onSubmit({
      ...task,
      tags: String(task.tags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      reminderMinutes: Number(task.reminderMinutes || 0),
      subtasks: task.subtasks || []
    });
  }

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) setNatural(transcript);
    };
    recognition.start();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-3xl border border-white/30 bg-white/50 p-3 dark:border-white/10 dark:bg-white/5">
        <label className="label">Natural language quick add</label>
        <div className="mt-2 flex gap-2">
          <input className="input" value={natural} onChange={(event) => setNatural(event.target.value)} placeholder="Meeting tomorrow at 4 PM" />
          <Button type="button" variant="subtle" onClick={applyNatural} className="shrink-0">
            <WandSparkles size={16} /> Parse
          </Button>
          <button type="button" className="icon-button shrink-0" onClick={startVoiceInput} aria-label="Voice input">
            <Mic size={17} />
          </button>
        </div>
      </div>

      <div>
        <label className="label">Task title</label>
        <input className="input mt-1" value={task.title} onChange={(event) => update('title', event.target.value)} placeholder="What needs to happen?" />
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input mt-1 min-h-20 resize-none" value={task.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Add context, links, or acceptance criteria" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input className="input mt-1" value={task.category} onChange={(event) => update('category', event.target.value)} />
        </div>
        <div>
          <label className="label">Tags</label>
          <input className="input mt-1" value={task.tags} onChange={(event) => update('tags', event.target.value)} placeholder="ux, launch, errands" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Due date</label>
          <input className="input mt-1" type="date" value={task.dueDate} onChange={(event) => update('dueDate', event.target.value)} />
        </div>
        <div>
          <label className="label">Due time</label>
          <input className="input mt-1" type="time" value={task.dueTime} onChange={(event) => update('dueTime', event.target.value)} />
        </div>
        <div>
          <label className="label">Priority</label>
          <select className="input mt-1" value={task.priority} onChange={(event) => update('priority', event.target.value)}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Reminder</label>
          <select className="input mt-1" value={task.reminderMinutes} onChange={(event) => update('reminderMinutes', event.target.value)}>
            <option value="10">10 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="1440">Tomorrow / 1 day before</option>
          </select>
        </div>
        <div>
          <label className="label">Repeat</label>
          <select className="input mt-1" value={task.repeat} onChange={(event) => update('repeat', event.target.value)}>
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="subtle" onClick={() => update('priority', recommendPriority(`${task.title} ${task.notes}`))}>
          <Brain size={16} /> Recommend priority
        </Button>
        <Button type="button" variant="subtle" onClick={() => update('subtasks', breakdownTask(task.title || 'this task'))}>
          <WandSparkles size={16} /> Break into subtasks
        </Button>
      </div>
      {!!task.subtasks?.length && (
        <div className="rounded-3xl bg-slate-950/5 p-3 dark:bg-white/5">
          {task.subtasks.map((subtask) => (
            <label key={subtask.id} className="flex items-center gap-2 py-1 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={subtask.completed} onChange={() => update('subtasks', task.subtasks.map((item) => item.id === subtask.id ? { ...item, completed: !item.completed } : item))} />
              {subtask.title}
            </label>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialTask ? 'Save changes' : 'Create task'}</Button>
      </div>
    </form>
  );
}
