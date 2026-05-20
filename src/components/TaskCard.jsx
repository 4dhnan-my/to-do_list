import { motion } from 'framer-motion';
import { CalendarClock, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge, Tag } from './Badge.jsx';
import { formatFriendlyDate, formatTime, isOverdue } from '../utils/date.js';

export function TaskCard({ task, settings, onToggle, onEdit, onDelete, draggable, onDragStart, onDragOver, onDrop }) {
  const doneCount = task.subtasks?.filter((item) => item.completed).length || 0;
  const total = task.subtasks?.length || 0;

  return (
    <motion.article
      layout
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`task-card ${task.completed ? 'opacity-70' : ''}`}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
    >
      <div className="flex gap-3">
        <button className={`check ${task.completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)} aria-label="Toggle complete" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className={`font-semibold text-slate-950 dark:text-white ${task.completed ? 'line-through' : ''}`}>{task.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{task.notes || 'No notes added'}</p>
            </div>
            <GripVertical className="mt-1 shrink-0 text-slate-300" size={17} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <Tag>{task.category}</Tag>
            {task.tags?.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className={`flex items-center gap-2 text-sm ${isOverdue(task) ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
              <CalendarClock size={15} />
              {formatFriendlyDate(task.dueDate)} {formatTime(task.dueTime, settings.timeFormat)}
            </div>
            {total > 0 && <span className="text-xs font-medium text-slate-500">{doneCount}/{total} subtasks</span>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="icon-button" onClick={() => onEdit(task)} aria-label="Edit task">
          <Pencil size={16} />
        </button>
        <button className="icon-button text-rose-500" onClick={() => onDelete(task)} aria-label="Delete task">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.article>
  );
}
