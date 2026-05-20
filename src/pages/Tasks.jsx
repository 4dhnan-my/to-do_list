import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { TaskCard } from '../components/TaskCard.jsx';

export function TasksPage({ tasks, settings, filters, setFilters, onToggle, onEdit, onDelete, onReorder, completedOnly = false }) {
  const visible = tasks
    .filter((task) => (completedOnly ? task.completed : !task.completed))
    .filter((task) => `${task.title} ${task.notes} ${task.category} ${task.tags?.join(' ')}`.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((task) => filters.priority === 'All' || task.priority === filters.priority)
    .filter((task) => filters.category === 'All' || task.category === filters.category)
    .sort((a, b) => a.order - b.order);

  const categories = ['All', ...new Set(tasks.map((task) => task.category))];

  return (
    <div className="space-y-5">
      <section className="panel">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input id="global-search" className="input pl-11" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Search tasks, notes, tags..." />
          </div>
          <select className="input" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value }))}>
            {['All', 'High', 'Medium', 'Low'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="input" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><SlidersHorizontal size={15} /> Drag cards to reorder. Everything auto-saves instantly.</p>
      </section>

      <motion.div layout className="grid gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              settings={settings}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              draggable
              onDragStart={(event) => event.dataTransfer.setData('text/plain', task.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => onReorder(event.dataTransfer.getData('text/plain'), task.id)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {!visible.length && (
        <section className="empty-state">
          <div className="mx-auto mb-4 h-16 w-16 rounded-[1.4rem] bg-gradient-to-br from-jade to-royal shadow-glow" />
          <h3 className="text-xl font-semibold">Nothing here yet</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Your filters are clear, or the list is beautifully done.</p>
        </section>
      )}
    </div>
  );
}
